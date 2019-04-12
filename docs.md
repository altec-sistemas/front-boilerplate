## Instalação

- [Instale o React Native CLI e suas dependências](https://facebook.github.io/react-native/docs/getting-started#installing-dependencies-3)
- Clone o repositório da aplicação de exemplo
- Instale o [Yarn](https://yarnpkg.com/en/)
- Vá para o repositório da aplicação de exemplo
- Instale as dependências com o comando `yarn`
- Para iniciar a aplicação em modo de desenvolvimento Web, execute `yarn start`
- Para iniciar a aplicação em modo de desenvolvimento Android, execute `react-native run-android`
- Para iniciar a aplicação em modo de desenvolvimento iOS, execute `react-native run-ios`
- Para iniciar a aplicação em modo de desenvolvimento Electron, inicie em modo de desenvolvimento Web e, em seguida, execute o comando `electron .`

## Arquitetura

O componente raíz da aplicação é o **App**.

```js
export default function App() {
  const [appState, setAppState] = useSetState({});

  useEffect(() => {
    (async () => {
      const token = await retrieve("token");
      setAppState({ token });
    })();
  }, []);

  return (
    <AppState.Provider value={{ appState, setAppState }}>
      <View style={styles.outer}>
        <Router>
          <View style={styles.container}>
            <Route exact path="/" component={Home} />
            <Route exact path="/sign-in" component={SignIn} />
            <PrivateRoute exact path="/users" component={Users} />
            <PrivateRoute path="/users/:id" component={User} />
          </View>
        </Router>
      </View>
    </AppState.Provider>
  );
}
```

No App, encontra-se a estrutura de rotas. O componente **Route** indica uma rota aberta e o componente **PrivateRoute** indica uma rota privada.

```js
<Router>
  <View style={styles.container}>
    <Route exact path="/" component={Home} />
    <Route exact path="/sign-in" component={SignIn} />
    <PrivateRoute exact path="/users" component={Users} />
    <PrivateRoute path="/users/:id" component={User} />
  </View>
</Router>
```

**AppState** é um context com o estado do App (`const AppState = React.createContext()`). Esse estado é transmitido para os descendentes do App, através do **Provider**, com dois valores: `appState` e `setAppState`. `appState` é o objeto do estado e `setAppState` é a função que o atualiza.

```js
<AppState.Provider value={{ appState, setAppState }}>
  {/* ... */}
</AppState.Provider>
```

Por ser descendente do App, PrivateRoute tem acesso ao `appState`. Se houver um token no `appState` (`!!appState.token`), a rota privada é renderizada. Se não houver, o usuário é redirecionado para a rota de sign-in.

```js
export default function PrivateRoute({ component: Component, ...rest }) {
  const { appState } = useContext(AppState);
  return (
    <Route
      {...rest}
      render={props =>
        !!appState.token ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/sign-in",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}
```

Componentes como o **SignIn** são chamados de _Interfaces_.

```js
export default function SignIn({ history, location }) {
  const { appState } = useContext(AppState);

  const {
    signInState,
    signIn,
    newUser,
    setNewUser,
    newPassword,
    setNewPassword
  } = useAuth({ history });

  const { from } = location.state || { from: { pathname: "/" } };

  return !!appState.token ? (
    <Redirect to={from} />
  ) : (
    <View>
      <TextInput
        style={styles.input}
        onChangeText={setNewUser}
        value={newUser}
      />
      <TextInput
        style={styles.input}
        onChangeText={setNewPassword}
        value={newPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={signIn} disabled={!newUser || !newPassword}>
        <Text>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}
```

Normalmente, Interfaces são views da aplicação. Recebem valores e funções de componentes chamados _Logic Hooks_ e transmitem os valores, através de **props**, para componentes chamados _Pure Components_. SignIn utiliza o Logic Hook **useAuth**.

```js
const {
  signInState,
  signIn,
  newUser,
  setNewUser,
  newPassword,
  setNewPassword
} = useAuth({ history });
```

useAuth possui a lógica de autenticação da aplicação e fornece para a Interface SignIn todas as funções e valores dessa lógica.

- A função `signIn` realiza a chamada para a API. `signInState` é o estado dessa chamada.
- `newUser` e `newPassword` fazem parte do estado interno do Logic Hook e são os novos valores a serem enviados na próxima chamada de `signIn`.
- `setNewUser` e `setNewPassword` são funções que atualizam os valores de `newUser` e `newPassword`, respectivamente.

Os Logic Hooks retornam, para as Interfaces, tanto os valores do estado interno, quanto as funções que os atualizam. As Interfaces, por sua vez, passam esses valores para os Pure Components. Pure Components recebem valores e chamam funções através de suas props.

No exemplo abaixo, a Interface **Users**, ao ser renderizada, chama a função fornecida pelo Logic Hook **useUsers** para buscar a lista de usuários. O resultado dessa busca é transmitido através da prop `data` para o Pure Component **CustomList** para que seja renderizado em uma lista. Quando um dos itens da lista é pressionado, uma função é chamada em Users a partir do CustomList através da prop `onPressItem`.

```js
export default withRouter(Users);

function Users({ history }) {
  const { signOut } = useAuth({ history });
  const {
    getUsersState: { status: getUsersStatus, data: getUsersData },
    getUsers
  } = useUsers();

  useEffect(() => {
    getUsers();
  }, []);

  function handlePressItem(item) {
    history.push(`/users/${item.id}`);
  }

  return (
    <View>
      <Text>Users (private view)</Text>
      <TouchableOpacity onPress={signOut}>
        <Text>Sign out</Text>
      </TouchableOpacity>
      <CustomList
        data={Array.isArray(getUsersData) ? getUsersData : []}
        keyExtractor={({ id }) => id.toString()}
        onRefresh={getUsers}
        refreshing={getUsersStatus === "pending"}
        onPressItem={item => handlePressItem(item)}
      >
        {item => <CustomListItem label={item.name} />}
      </CustomList>
    </View>
  );
}
```

```js
export default function CustomList({ children, onPressItem, ...rest }) {
  function Item({ item }) {
    return (
      <TouchableOpacity onPress={() => onPressItem(item)}>
        {children(item)}
      </TouchableOpacity>
    );
  }

  return <FlatList renderItem={Item} {...rest} />;
}
```

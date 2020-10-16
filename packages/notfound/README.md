# 404 Not Found Package

This package is used to handle http 404 errors i.e when user tries to access a page that is not available

## Installation

```node
yarn add @opensrp/Not-found
```

## Code example

```JSX

const App = () => {
  return (
    <Layout>
      <Content>
        <Switch>
          <Route exact path="/admin" component={AdminComponent} />
          <Route exact component={NotFound} />
        </Switch>
      </Content>
    </Layout>
  );
};

export default App;
```

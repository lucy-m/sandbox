describe('my-react-lib: MyReactLib component', () => {
  beforeEach(() => cy.visit('/iframe.html?id=myreactlib--primary'));
    
    it('should render the component', () => {
      cy.get('h1').should('contain', 'Welcome to MyReactLib!');
    });
});

## Instructions

1. Install and run the applications
2. Open UI application and login using following credentials. 
   - **Username**: user@mail.com
   - **Password**: 123456
3. Visit products page and click the add button to add products into your cart
4. Click cart icon at the top-right of the page to go to cart page
5. Click Create Order button to create new order from selected products
6. Created orders if not completed (submitted), they can be submitted later using `Complete Order` button at the orders page

## Architecture

1.  DDD (Domain Driven Design) approach has been used. Instead of strict discrimination of the Infrastructure and the Domain layer. I follow more SPA based logic and merge them under the \`store\` layer.
2.  Each domain has own store and infrastructure and domain components such as model, services, states etc
3.  Application layer introduced as modules which contains lazy loaded modules (features)
4.  Application have also core module where our configurations and application wide definitions declared and stored

## Manual Installation

1.  Clone repository via git cli `git clone git@github.com:hsntngr/shopping-ui.git`
2.  Install dependencies via `npm install`
3.  Run the application via `npm start`
4.  When the application ready visit the [http://localhost:4200](http://localhost:4200)

## Docker

1.  Create an image via `docker build -t [authority]/shopping-ui`
2.  Create a container from image via `` `docker run -d --restart always --name shopping-ui-instance -p [PORT]:80 [authority]/shopping-ui` ``
3.  When the application ready visit the [http://localhost:\[PORT\]](http://localhost:[PORT])

## Testing (Unit Tests)

1.  `Karma` used as a Test runner
2.  `Jasmine` used as a testing framework
3.  Number of Tests: `66`
4.  Test Coverage: `100%`

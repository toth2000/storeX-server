# StoreX Server Repository

This is the backend server repository of StoreX, a complete full-stack online shopping website with payment gateway integration.

Website: https://store-x-website.vercel.app/ <br>
Backend Server Link: https://store-x-backend.onrender.com/

---

#### StoreX Website Repository

To view the frontend website repository of StoreX visit https://github.com/toth2000/storeX-website 

---

# Features
- Ability to sort products based on price or arrival 
- Ability to filter products based on categories 
- Items on cart are saved to the database for easy browsing from multiple devices
- Order history page showing list of ordered item
- Order and payment confirmation email feature
- A wide range of payment options available with the RazorPay payment gateway integration

---
## Requirements

For development, you will only need Node.js and ReactJs installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g


---

## Install

    $ git clone https://github.com/toth2000/storeX-server
    $ cd storeX-server

#### To Run the Backend Server locally
    $ npm install
    $ node index.js

## Contribution guidelines

Please refer to our [Contribution Guide](https://github.com/toth2000/SellGuds/blob/master/CONTRIBUTING.md) for contributing to this project. And remeber no contribution is small,  every contribution matters.

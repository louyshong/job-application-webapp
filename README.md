# Job application webapp

A simple Node.js job application webapp. 

Using a multi-step form, applicants fill in their details and upload their CV, which will then be emailed to a configurable recipient email address upon form submission. A service email account was created for this purpose, and a `.env` file containing the authentication credentials for this email service is needed to run the webapp locally.  

### Getting started
1. Make sure you have [Node.js](https://nodejs.org/en/download/) (v14+) installed
2. Clone this repository
```
git clone https://github.com/louyshong/job-application-webapp.git
```
3. `cd` into the repository and install npm dependencies
```
cd job-application-webapp
npm i
```
4. Place the `.env` file containing the authentication credentials for the email service at the root of this repository
5. Configure the recipient email address in the `.env` file
```
RECIPIENT_EMAIL="<YOUR EMAIL HERE>"
```
6. Run the app
```
node app.js
```
7. Open port 3000 in your favourite browser
```
localhost:3000
```

### File structure
| Folder or file | Description |
| -------------- | ----------- |
|`public` folder | Contains CSS and JavaScript loaded by `form.html` | 
|`views` folder  | Contains a template file for submission failure   | 
|`app.js`        | App entry point                                   |
|`form.html`     | Main page                                         |
|`success.html`  | Page for successful submission                    |
|`package.json`  | Contains required packages                        |

### Acknowledgements
This webapp was built using standard [Bootstrap](https://getbootstrap.com/) components. 
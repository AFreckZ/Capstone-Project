# Yaad Quest Trip planning Web app 
## Prerequisites

Please ensure you have the following to run the project sucessfully.If not kindly download them at the following links and follow the steps given to install them.
- Node.js (v14 or higher) - https://nodejs.org/ 
- npm 
- MySQL installed locally - https://dev.mysql.com/downloads/ 
- Git-  https://git-scm.com/

# Steps to Set Up YaadQuest
To run the YaadQuest capstone project please do the do following:
1. Navigate to your downloads using your terminal
2. Paste the following line into the terminal.   " git clone https://github.com/AFreckZ/Capstone-Project.git ".
4. Open your IDE (vscode, spyder etc.) and open the Capstone-project folder, " cd Capstone-Project ".
5. Once the folder is opened in your IDE, install all the dependencies by  pasting this in the terminal( that is within you IDE) " npm install ".
6. Log into MYSQL, through your terminal as root, " mysql -u root -p ".
7. Create a database by Pasting this in the terminal " CREATE DATABASE YaadQuest; " , then " SHOW DATABASES " to ensure the database has been created, then exit MYSQL.
8. To transfer the tables and their information to your database, paste this in your terminal. " mysql -u root -p YaadQuest < database.sql ", you will be prompted to enter your MySQL password for the root/user that you have created and have granted this databases permissions to.
9. Log into mysql again, entering " mysql -u root -p " and enter " use YaadQuest;" then" show tables;", once this is not an empty set, you have successfully intergrated the tables into your local database.
10. Enter the following line in the mysql terminal, " Select * from user Limit 5;", once this is not an empty set the database has successfully been set up, exit this terminal.
11. Go to the .env.example file and change its name to .env, then change the DB_USER to to the user that has permissions to the database, and DB_Password to the password of that user.
12. Navigate to the server folder, of the project using your terminal, and run " node generate-secret.js ", to generate a secret key. Once this has been ran, check your .env file to ensure the JWT_SECRET has been updated.


## Running the YaadQuest Website
1. Open the project into an IDE.
2. Open a terminal within the IDE and enter " cd server ", then " npm install " and finally, "node server.js". You should now see "Server running on http://localhost:5001
Successfully connected to MySQL database" in the terminal and this will successfully indicate that the server is running.
3. Open another terminal within the same IDE and enter " cd client ", then "npm install" and finally " npm start". You should now see "starting development server" in the terminal and be carried to a web page that welcomes you to YaadQuest.


# Troubleshooting Common Issues
Database Connection Issues
If you see "Access denied" errors:
- Verify your MySQL password is correct
- Ensure your .env file has actual values, not placeholder text
- Test connection: mysql -u root -p YaadQuest

# Project Features
- Once running, you can test:
- User Registration/Login
- Tourist Preferences Setup
- Itinerary Generation
- Transportation Assignment
- Map Visualization
- Agency Management (for transport companies)


Access Points
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

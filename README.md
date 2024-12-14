## Instructions

1. Install [PostgreSQL](https://www.postgresql.org/) 

2. Install [Node.js 18.18](https://nodejs.org/) or later.

3. Run the `db.sql` script to initialize the DB.

4. Set the **host, port, user, password, database** in the .env file in the root directory 

   ```json
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=test
   POSTGRES_PASSWORD=123456
   POSTGRES_DATABASE=demo_db
   
   AUTH_SECRET=ZmRpd2x6aXFvO2RmZHM
   ```

5. Open the terminal program, locate at the same directory and run `npm install` . After all the dependencies are installed, then run `npm run dev` command. 

6. When the console shows "Ready", open the browser(recommend using Chrome) and enter ` http://localhost:3000` . The test account is  `test_account@gmail.com`   and password is `eHBxcGt4`. Both have been filled out by default.

7. After logging in, the ui demonstrates.
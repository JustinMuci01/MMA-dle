from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector import Error
import mysql.connector
import os
app = FastAPI()


mydb = mysql.connector.connect(
    host = os.environ.get('DB_HOST'),
    user=os.environ.get('DB_USER'),
    password=os.environ.get('DB_PWORD'),
    database = os.environ.get('DB')
)

origins = ["http://localhost:5173",
        "http://127.0.0.1:5173",]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/names")
def extract_info():
    try:
        cursor = mydb.cursor()
        query = """SELECT Name FROM Fighters;"""

        cursor.execute(query)  
        result = cursor.fetchall()

        
        cursor.close()
        resultList = []
        for line in result:
            resultList.append(line[0])

        print(resultList)
        if not result:
            raise HTTPException(status_code = 404, detail="Fighter Not Found")
        
        return resultList
    except Error as e:  
        raise HTTPException(status_code = 500, detail="Internal Service Error")

@app.get("/fighters/")
def extract_info(fighter):
    try:
        cursor = mydb.cursor()
        query = """SELECT * FROM Fighters WHERE Name = %s Limit 1;"""

        print(fighter)
        cursor.execute(query, (fighter, ))  
        result = cursor.fetchone()

        print(fighter)
        cursor.close()

        if not result:
            raise HTTPException(status_code = 404, detail="Fighter Not Found")
        
        return result
    except Error as e:  
        raise HTTPException(status_code = 500, detail="Internal Service Error")
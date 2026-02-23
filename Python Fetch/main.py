from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mysql.connector import Error
import mysql.connector
import os
app = FastAPI()


mydb = mysql.connector.connect(
    host=os.environ.get('DB_HOST'),
    port=os.environ.get('DB_PORT'),
    user=os.environ.get('DB_USER'),
    password=os.environ.get('DB_PWORD'),
    database=os.environ.get('DB')
)


string = "mysql://root:HBRQxiblbNoQsefdDWyNDmjXoSLvdMJg@yamabiko.proxy.rlwy.net:28793/railway"

origins = ["*"]

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
        query = """SELECT Name FROM fighters;"""

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
        print(f"Database error: {e}")
        raise HTTPException(status_code = 500, detail=str(e))

@app.get("/fighters/")
def extract_info(fighter):
    try:
        cursor = mydb.cursor()
        query = """SELECT * FROM fighters WHERE Name = %s Limit 1;"""

        print(fighter)
        cursor.execute(query, (fighter, ))  
        result = cursor.fetchone()

        print(fighter)
        cursor.close()

        if not result:
            raise HTTPException(status_code = 404, detail="Fighter Not Found")
        
        return result
    except Error as e:  
        print(f"Database error: {e}")
        raise HTTPException(status_code = 500, detail=str(e))
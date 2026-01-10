from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from data import mydb
from mysql.connector import Error
app = FastAPI()

@app.get("/{fighter}")
def extract_info(name):
    try:
        cursor = mydb.cursor()
        query = """SELECT * FROM Fighters WHERE Name = %s Limit 1;"""

        cursor.execute(query)  
        result = cursor.fetchone()
        cursor.close
        mydb.close()

        if not result:
            raise HTTPException(status_code = 404, detail="Fighter Not Found")
        
        return result
    except Error as e:  
        raise HTTPException(status_code = 500, detail="Internal Service Error")
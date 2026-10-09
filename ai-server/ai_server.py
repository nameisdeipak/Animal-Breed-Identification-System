from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import random

app = FastAPI()

class ImageRequest(BaseModel):
    imageUrl: str

# 
breeds = [
    {"breed": "Gir", "origin": "Gujarat", "milk": "12-15L", "confidence": 98.5},
    {"breed": "Sahiwal", "origin": "Punjab", "milk": "15-22L", "confidence": 94.2},
    {"breed": "Murrah (Buffalo)", "origin": "Haryana", "milk": "25-30L", "confidence": 97.8},
    {"breed": "Tharparkar", "origin": "Rajasthan", "milk": "10-13L", "confidence": 91.0},
]

@app.post("/predict")
async def predict_breed(request: ImageRequest):
    if not request.imageUrl:
        raise HTTPException(status_code=400, detail="No image URL provided")

    prediction = random.choice(breeds)
    return prediction

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
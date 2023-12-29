def percentage_to_value(percentage, total_value):     
    if percentage < 0 or percentage > 100:         
        raise ValueError("Percentage must be between 0 and 100")     
    return (percentage / 100) * total_value



async def calculateRatePer(metadata:object,ratePer:int=0):
    otherPrice = metadata.otherPrice
    flowerPrice = metadata.flowerPrice
    totalPrice = metadata.totalPrice
    if int(ratePer) > 0:
        percentage = int(ratePer)
        perValue = percentage_to_value(int(percentage), int(flowerPrice))
        totalPrice = int(flowerPrice) + int(otherPrice) + int(perValue)
    else:
        totalPrice = metadata.totalPrice        
    return totalPrice
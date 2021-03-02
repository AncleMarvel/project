import requests

class Service:
    api = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/" 

    @staticmethod
    def getResponse(method):
        response = requests.get(Service.api + method)
        return response.json()

service = Service()
json = service.getResponse("catalogData.json")
print(json)

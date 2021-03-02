import requests
api = "https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/"

class Service:
    def __init__(self, baseUrl, method):
        self.baseUrl = baseUrl
        self.method = method

    def getResponse(self):
        response = requests.get(self.baseUrl + self.method)
        return response.json()

service = Service(api, 'catalogData.json')
json = service.getResponse()
print(json)

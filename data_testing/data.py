import requests

# Define the URL
url = "https://e4ftl01.cr.usgs.gov/MOLT/MOD13Q1.061/2020.03.21/MOD13Q1.A2020081.h12v11.061.2020335012536.hdf"

# Define the headers
headers = {
    "Host": "e4ftl01.cr.usgs.gov",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/png,image/svg+xml,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "DNT": "1",
    "Sec-GPC": "1",
    "Connection": "keep-alive",
    "Referer": "https://e4ftl01.cr.usgs.gov/MOLT/MOD13Q1.061/2020.03.21/",
    "Cookie": "DATA=ZvYwaL_ZCKppKvV3XiWcnQAAAHc",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Priority": "u=0, i"
}

# Send the GET request
response = requests.get(url, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    print("Request successful!")
    # You can save the content to a file
    with open(url, 'wb') as file:
        file.write(response.content)
else:
    print(f"Request failed with status code {response.status_code}")

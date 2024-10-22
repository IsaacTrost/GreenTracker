import requests
from bs4 import BeautifulSoup
import os

def scrape_dates(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    dates = []
    for link in soup.find_all('a'):
        href = link.get('href')
        if href.endswith('/'):
            dates.append(href)
    return dates

def get_files(url, date, tiles):
    print(url+  date)
    response = requests.get(url + date)
    soup = BeautifulSoup(response.text, 'html.parser')
    files = []
    for link in soup.find_all('a'):
        href = link.get('href')
        if any(tile in href for tile in tiles) and "jpg" not in href:
            files.append(href)
    return files

def download_file_hdf(url, date, file):
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
        "Cookie": "DATA=Zxb1C77-NpCzdq0Z62M5UAAAAFk",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Priority": "u=0, i"
    }


    response = requests.get(url + date + file, headers=headers)
    new_name = file.replace("MOD13A1.A2000049.", "").replace(".061", "").replace(".hdf", "").replace(".", "_") + ".hdf"
    # Check if the request was successful
    if response.status_code == 200:
        print("Request successful!")
        # You can save the content to a file
        with open(new_name, 'wb') as file:
            file.write(response.content)
    else:
        print(f"Request failed with status code {response.status_code}")

    return new_name


def download_file_xml(url, date, file):
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
        "Cookie": "DATA=Zxb1C77-NpCzdq0Z62M5UAAAAFk",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Priority": "u=0, i"
    }


    response = requests.get(url + date + file, headers=headers)
    new_name = file.replace("MOD13A1.A2000049.", "").replace(".061", "").replace(".xml", "").replace(".", "_") + ".xml"
    # Check if the request was successful
    if response.status_code == 200:
        print("Request successful!")
        # You can save the content to a file
        with open(new_name, 'wb') as file:
            file.write(response.content)
    else:
        print(f"Request failed with status code {response.status_code}")

    return new_name
def trim_data(file_path):
    print("trimming data and converting to tiff" + file_path)
    from osgeo import gdal
    import numpy as np

    # Path to your HDF file

    # Open the HDF file
    gdal_file = gdal.Open(file_path)
    print("opened file")

    # Check the subdatasets (assuming the file has multiple datasets like most HDF files)
    subdatasets = gdal_file.GetSubDatasets()


    # You need to identify the correct subdataset that contains EVI data.
    # Typically, MODIS data has subdatasets like "MOD_Grid_BRDF:BRDF_Albedo_Parameter1", etc.
    # You'll need to inspect your specific file to find the EVI dataset.
    # For the sake of this example, we'll assume the EVI subdataset is at index 0.

    # Open the EVI subdataset (you might need to change the index depending on your file)
    evi_dataset = gdal.Open(subdatasets[1][0]) 
    vi_quality_band = gdal.Open(subdatasets[2][0])
    vi_quality_data = vi_quality_band.ReadAsArray()

    # Extract specific bits
    # Extract bits 0-1 for VI usefulness (use bitwise AND to isolate the bits, and shift them into position)
    vi_usefulness = (vi_quality_data & 0b11)  # Bits [0-1]

    # Extract bits 2-5 for Aerosol quantity (shift right by 2, then mask the 4 bits)
    aerosol_quantity = (vi_quality_data >> 2) & 0b1111  # Bits [2-5]

    # Extract bits 6-7 for Cloud adjacency (shift right by 6, then mask the 2 bits)
    cloud_adj = (vi_quality_data >> 6) & 0b11  # Bits [6-7]

    # Combine these into an 8-bit value by shifting the bits into place
    # For example, combining usefulness and aerosol quantity into an 8-bit value
    combined_quality = (cloud_adj << 6) | (aerosol_quantity << 2) | vi_usefulness  # 8-bit combined value
    output_tif = file_path.replace('.hdf', '.tif')

    # Get driver for GeoTIFF format
    driver = gdal.GetDriverByName("GTiff")

    # Create the GeoTIFF file with the same dimensions and type as the original dataset
    out_tif = driver.Create(output_tif, 
                            evi_dataset.RasterXSize, 
                            evi_dataset.RasterYSize, 
                            evi_dataset.RasterCount, 
                            evi_dataset.GetRasterBand(1).DataType)

    # Set georeferencing information (projection and geotransform)
    out_tif.SetProjection(evi_dataset.GetProjection())
    out_tif.SetGeoTransform(evi_dataset.GetGeoTransform())

    # Copy each band from the original dataset to the new GeoTIFF

    in_band = evi_dataset.GetRasterBand(1)
    out_band = out_tif.GetRasterBand(1)

    # Copy data from original band to GeoTIFF band
    out_band.WriteArray(in_band.ReadAsArray())

    # Copy metadata
    out_band.SetNoDataValue(in_band.GetNoDataValue())

    out_tif.FlushCache()
    out_tif = None

    output_tif = "evi_quality.tif"

    # Add a new band specifically for the quality data as GDT_Byte
    out_tif = driver.Create(output_tif, 
                            evi_dataset.RasterXSize, 
                            evi_dataset.RasterYSize, 
                            1, 
                            gdal.GDT_Byte)
    out_band = out_tif.GetRasterBand(1)

    # Copy data from original band to GeoTIFF band
    out_band.WriteArray(combined_quality.astype(np.uint8))

    # Copy metadata
    out_band.SetNoDataValue(in_band.GetNoDataValue())
    out_band.FlushCache()
    out_tif = None
    return output_tif


if __name__ == '__main__':
    total_size = 0
    url = 'https://e4ftl01.cr.usgs.gov/MOLT/MOD13A1.061/'
    dates = scrape_dates(url)
    tiles = ['h12v05', 'h12v04']
    stored_name = ""
    for date in dates:
        files = get_files(url, date, tiles)
        print(files)
        for file in files:
            if "xml" in file:
                stored_name = download_file_xml(url, date, file)
            else:
                new_name = download_file_hdf(url, date, file)
                stored_name = trim_data(new_name)
                os.remove(new_name)
            total_size += os.path.getsize(stored_name)
            # If it gets over 100 gigs we need to kill it
            if total_size > 100000000000:
                break
            print(f"Processed {file}")


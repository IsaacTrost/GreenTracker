from osgeo import gdal
import numpy as np

# Path to your HDF file
file_path = 'downloaded_file.hdf'

# Open the HDF file
gdal_file = gdal.Open(file_path)

# Check the subdatasets (assuming the file has multiple datasets like most HDF files)
subdatasets = gdal_file.GetSubDatasets()

# Print subdatasets for reference
print("Subdatasets in the HDF file:")
for i, subdataset in enumerate(subdatasets):
    print(f"{i}: {subdataset[1]}")

# You need to identify the correct subdataset that contains EVI data.
# Typically, MODIS data has subdatasets like "MOD_Grid_BRDF:BRDF_Albedo_Parameter1", etc.
# You'll need to inspect your specific file to find the EVI dataset.
# For the sake of this example, we'll assume the EVI subdataset is at index 0.

# Open the EVI subdataset (you might need to change the index depending on your file)
evi_dataset = gdal.Open(subdatasets[1][0])  # Replace '0' with the correct index if needed

# Read the data into a NumPy array
evi_array = evi_dataset.ReadAsArray()

# Print some basic information about the data
print(f"EVI data shape: {evi_array.shape}")
print(f"EVI data type: {evi_array.dtype}")

# Assuming you want to save the data to a file for further analysis
np.save("evi_data.npy", evi_array)  # Save as a NumPy array for future use

# If you want to perform simple operations on the EVI data (e.g., checking min/max)
print(f"EVI Min: {np.min(evi_array)}")
print(f"EVI Max: {np.max(evi_array)}")

# Optionally, save the array as a CSV if that's easier for you to process later
np.savetxt("evi_data.csv", evi_array, delimiter=",")

# If the dataset has geospatial information, you can retrieve that as well
geotransform = evi_dataset.GetGeoTransform()
projection = evi_dataset.GetProjection()

print("Geotransform:", geotransform)
print("Projection:", projection)

# Clean up
evi_dataset = None
gdal_file = None
import matplotlib.pyplot as plt

# Display the EVI data as an image
plt.imshow(evi_array, cmap='viridis')
plt.colorbar(label='EVI')
plt.title('EVI Data')
plt.xlabel('Column Index')
plt.ylabel('Row Index')
# Save the plot as an image file
plt.savefig("evi_data_plot.png")
plt.show()
print("DONE")
import pandas as pd
import numpy as np

df = pd.read_csv('Dataset.csv')

# pull the type column into its own np array
y = df['Type'].values

# drop the type column from the dataframe
df.drop(columns=['Type'], inplace=True)

# remove labels from the dataframe
X = df.values

# save the data and labels to numpy files
np.save('data.npy', X)
np.save('labels.npy', y)
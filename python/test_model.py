import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib.pyplot as plt # data visualization
import seaborn as sns # statistical data visualization
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report
import pickle
model_pkl_file = "random_forest_model.pkl"


# load model from pickle file
with open(model_pkl_file, 'rb') as file:  
    model = pickle.load(file)

df= pd.read_csv('Dataset.csv')

# Assuming df is your DataFrame
X = df.iloc[:,1:]  #features
y = df.iloc[:,:1].values  # Target variable

X = X.drop(['average_number_of_dots_in_subdomain', 'having_special_characters_in_subdomain', 'having_hyphen_in_subdomain', 'having_dot_in_subdomain', 'having_repeated_digits_in_subdomain', 'having_path', 'average_number_of_hyphens_in_subdomain'], axis=1)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.20, random_state = 42)

# uncomment to get just the stuff used to test
#X_test.to_csv('x_test')

print(X_test)

# evaluate model 
y_predict = model.predict(X_test)

# check results
print(classification_report(y_test, y_predict)) 
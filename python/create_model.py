import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib.pyplot as plt # data visualization
import seaborn as sns # statistical data visualization
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import classification_report
from sklearn.metrics import ConfusionMatrixDisplay
import pickle
import warnings

warnings.filterwarnings('ignore')

df= pd.read_csv('training_dataset.csv')

# Assuming df is your DataFrame
X = df.iloc[:,1:]  #features
y = df.iloc[:,:1].values  # Target variable

X = X.drop(['average_number_of_dots_in_subdomain', 'having_special_characters_in_subdomain', 'having_hyphen_in_subdomain', 'having_dot_in_subdomain', 'having_repeated_digits_in_subdomain', 'having_path', 'average_number_of_hyphens_in_subdomain'], axis=1)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size = 0.20, random_state = 42)

# instantiate the classifier 
rfc = RandomForestClassifier(n_estimators=100, random_state=0)

# fit the model
rfc.fit(X_train, y_train)

# Predict the Test set results
y_pred = rfc.predict(X_test)

# Check accuracy score 
print('Model accuracy score with 100 decision-trees : {0:0.4f}'. format(accuracy_score(y_test, y_pred)))

clf = RandomForestClassifier(n_estimators=100, random_state=0)

# fit the model to the training set
clf.fit(X_train, y_train)
feature_scores = pd.Series(clf.feature_importances_, index=X_train.columns).sort_values(ascending=False)
print(feature_scores)

# Creating a seaborn bar plot
sns.barplot(x=feature_scores, y=feature_scores.index)

# Add labels to the graph
plt.xlabel('Feature Importance Score')
plt.ylabel('Features')

# Add title to the graph
plt.title("Visualizing Important Features")

cm = confusion_matrix(y_test, y_pred)
print('Confusion matrix\n\n', cm)
print(classification_report(y_test, y_pred))

model_pkl_file = "random_forest_model.pkl"
with open(model_pkl_file, 'wb') as file:  
    pickle.dump(rfc, file)

# Visualize the graph
plt.show()
display=ConfusionMatrixDisplay(confusion_matrix=cm)
plt.clf()
display.plot()
plt.show()

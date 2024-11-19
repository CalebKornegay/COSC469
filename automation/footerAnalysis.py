import json

with open('footerdata.json', 'r') as file:
    data = json.load(file)

# Initialize counts
phishing_total = 0
phishing_with_data = 0
non_phishing_total = 0
non_phishing_with_data = 0

TP = 0  # True Positive
FP = 0  # False Positive
TN = 0  # True Negative
FN = 0  # False Negative


for entry in data:
    is_phishing = entry['isPhishing']
    footer = entry['footer']
    if is_phishing:
        phishing_total += 1
        if footer != 'Disabled':
            phishing_with_data += 1
            if footer == 'False':
                TP += 1
            elif footer == 'True':
                FN += 1
    else:
        non_phishing_total += 1
        if footer != 'Disabled':
            non_phishing_with_data += 1
            if footer == 'False':
                FP += 1
            elif footer == 'True':
                TN += 1

phishing_data_percentage = (phishing_with_data / phishing_total * 100)
non_phishing_data_percentage = (non_phishing_with_data / non_phishing_total * 100)

true_positive_rate = (TP / (TP + FN) * 100)
false_positive_rate = (FP / (FP + TN) * 100)
true_negative_rate = (TN / (TN + FP) * 100)
false_negative_rate = (FN / (FN + TP) * 100)

total_predictions = TP + FP + TN + FN
accuracy = ((TP + TN) / total_predictions * 100)

print(f"Percentage of phishing sites with enough data: {phishing_data_percentage:.2f}%")
print(f"Percentage of non-phishing sites with enough data: {non_phishing_data_percentage:.2f}%")
print(f"True Positive Rate: {true_positive_rate:.2f}%")
print(f"False Positive Rate: {false_positive_rate:.2f}%")
print(f"True Negative Rate: {true_negative_rate:.2f}%")
print(f"False Negative Rate: {false_negative_rate:.2f}%")
print(f"Overall Accuracy: {accuracy:.2f}%")


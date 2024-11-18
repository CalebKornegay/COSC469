import json
import numpy as np
import time
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt

test_results: list[str] = []
tests: list[str] = ["cert", "db", "dns", "ml", "url"]

with open('merged.json', 'r') as f:
    test_results = json.load(f)

t_pos: list[int] = [0] * len(tests)
f_pos: list[int] = [0] * len(tests)
t_neg: list[int] = [0] * len(tests)
f_neg: list[int] = [0] * len(tests)
num_correct: int = 0
num_pred_phishing: int = 0
non_phishing: int = 0
phishing: int = 0
conf_matrices: list = []
y_real: list[list[bool]] = []
y_act: list[list[bool]] = []
overall_real: list[bool] = []
overall_act: list[bool] = []
i = 0

for index, result in enumerate(test_results):
    result_status: dict = eval(result)
    non_phishing += result_status["isPhishing"] == False
    phishing += result_status["isPhishing"] == True
    # if non_phishing == phishing: break

    correct: bool = True
    num_phishing: int = 0
    pred_phishing: bool = False
    real = []
    act = []

    for test_index, test in enumerate(tests):
        t_pos[test_index] += result_status[test] == False and result_status["isPhishing"] == True
        f_pos[test_index] += result_status[test] == False and result_status["isPhishing"] == False
        t_neg[test_index] += result_status[test] == True and result_status["isPhishing"] == False
        f_neg[test_index] += result_status[test] == True and result_status["isPhishing"] == True

        if not result_status[test]: pred_phishing = True
        num_phishing += not result_status[test]
        
        act.append(result_status["isPhishing"])
        real.append(not result_status[test])

        if result_status[test] == result_status["isPhishing"]: correct = False

    overall_act.append(result_status["isPhishing"])
    if num_phishing == 5 and result_status["isPhishing"] or num_phishing == 0 and not result_status["isPhishing"]:
        overall_real.append(result_status["isPhishing"])
    else:
        overall_real.append(not result_status["isPhishing"])
    # overall_real.append(pred_phishing)

    y_real.append(real)
    y_act.append(act)

    num_correct += correct
    # num_correct += (pred_phishing == result_status["isPhishing"])

for test_index, test in enumerate(tests):
    print(f"True positive rate for {test} test = {t_pos[test_index] / (t_pos[test_index] + f_neg[test_index]) * 100}%")
    print(f"False positive rate for {test} test = {f_pos[test_index] / (f_pos[test_index] + t_neg[test_index]) * 100}%")
    print(f"True negative rate for {test} test = {t_neg[test_index] / (t_neg[test_index] + f_pos[test_index]) * 100}%")
    print(f"False negative rate for {test} test = {f_neg[test_index] / (f_neg[test_index] + t_pos[test_index]) * 100}%")
    print(f"Accuracy for {test} test is {(t_pos[test_index] + t_neg[test_index]) / (phishing + non_phishing) * 100}%")

print(f"Overall testing accuracy is {num_correct / (phishing + non_phishing) * 100}%")

y_real = np.array(y_real).T
y_act = np.array(y_act).T

conf_matrices = [ConfusionMatrixDisplay(confusion_matrix=np.array(confusion_matrix(act, real))) for (act, real) in zip(y_act, y_real)] + [ConfusionMatrixDisplay(confusion_matrix=confusion_matrix(overall_act, overall_real))]

for i, matrix in enumerate(conf_matrices):
    matrix.plot()
plt.show()
import json
import numpy as np

test_results: list[str] = []
tests: list[str] = ["cert", "db", "dns", "ml", "url"]

with open('merged.json', 'r') as f:
    test_results = json.load(f)

t_pos = [0] * len(tests)
f_pos = [0] * len(tests)
t_neg = [0] * len(tests)
f_neg = [0] * len(tests)
num_correct = 0

for index, result in enumerate(test_results):
    result_status: dict = eval(result)
    correct = True

    for test_index, test in enumerate(tests):
        t_pos[test_index] += result_status[test] == True and result_status["isPhishing"] == True
        f_pos[test_index] += result_status[test] == False and result_status["isPhishing"] == True
        t_neg[test_index] += result_status[test] == False and result_status["isPhishing"] == False
        f_neg[test_index] += result_status[test] == True and result_status["isPhishing"] == False

        if result_status[test] != result_status["isPhishing"]: correct = False

    num_correct += correct

for test_index, test in enumerate(tests):
    print(f"True positive rate for {test} test = {t_pos[test_index] / len(test_results) * 100}%")
    print(f"False positive rate for {test} test = {f_pos[test_index] / len(test_results) * 100}%")
    print(f"True negative rate for {test} test = {t_neg[test_index] / len(test_results) * 100}%")
    print(f"False negative rate for {test} test = {f_neg[test_index] / len(test_results) * 100}%")
    print(f"Accuracy for {test} test is {(t_pos[test_index] + t_neg[test_index]) / len(test_results) * 100}%")

print(f"Overall testing accuracy is {num_correct / len(test_results) * 100}")
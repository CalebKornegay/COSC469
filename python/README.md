# PYTHON FILES

These were used to generate the model used in MLQuery. Some form of this runs on the server and we request it to evaluate with some parameters. This was done as it is difficult to do RandomForests in TypeScript.

* call it: feature_extraction.py [url]
    * returns the probability that the url is a phishing website

## Requirements

* [Dataset.csv](https://data.mendeley.com/datasets/6tm2d6sz7p/1)
* `pip install numpy pandas matplotlib seaborn scikit-learn pickle`

## Where is the model?

It is way too big for a github repo. Its on the server.
from urllib.parse import urlparse
import string
import collections as ct
import math
import tldextract
import sys
import pandas as pd
import pickle

column_titles = ['url_length',
                 'number_of_dots_in_url',
                 'having_repeated_digits_in_url',
                 'number_of_digits_in_url',
                 'number_of_special_char_in_url',
                 'number_of_hyphens_in_url',
                 'number_of_underline_in_url',
                 'number_of_slash_in_url',
                 'number_of_questionmark_in_url',
                 'number_of_equal_in_url',
                 'number_of_at_in_url',
                 'number_of_dollar_in_url',
                 'number_of_exclamation_in_url',
                 'number_of_hashtag_in_url',
                 'number_of_percent_in_url',
                 'domain_length',
                 'number_of_dots_in_domain',
                 'number_of_hyphens_in_domain',
                 'having_special_characters_in_domain',
                 'number_of_special_characters_in_domain',
                 'having_digits_in_domain',
                 'number_of_digits_in_domain',
                 'having_repeated_digits_in_domain',
                 'number_of_subdomains',
                 'having_dot_in_subdomain',
                 'having_hyphen_in_subdomain',
                 'average_subdomain_length',
                 'average_number_of_dots_in_subdomain',
                 'average_number_of_hyphens_in_subdomain',
                 'having_special_characters_in_subdomain',
                 'number_of_special_characters_in_subdomain',
                 'having_digits_in_subdomain',
                 'number_of_digits_in_subdomain',
                 'having_repeated_digits_in_subdomain',
                 'having_path',
                 'path_length',
                 'having_query',
                 'having_fragment',
                 'having_anchor',
                 'entropy_of_url',
                 'entropy_of_domain'
]


def shannon_entropy(url):
    """Calculates the Shannon entropy of a URL."""

    url_string = url

    # Create a frequency dictionary of characters
    char_counts = {}
    for char in url_string:
        char_counts[char] = char_counts.get(char, 0) + 1

    # Calculate entropy
    entropy = 0.0
    total_chars = len(url_string)
    for char, count in char_counts.items():
        probability = count / total_chars
        entropy -= probability * math.log2(probability)

    return entropy

def has_numbers(inputString):
    return any(char.isdigit() for char in inputString)

def num_digits(str:str) -> int:
      return str.count('0') + str.count('1') + str.count('2') + str.count('3') + str.count('4') + str.count('5') + str.count('6') + str.count('7') + str.count('8') + str.count('9')

def has_repeating_digits(string:str) -> bool:
    previous_is_digit = False
    for char in string:
        if char.isdigit():
            if previous_is_digit:
                return True
            else:
                previous_is_digit = True
        else:
             previous_is_digit = False
    
    return False


def extract_features(url:str):
    # Extract domain, path, query, fragment from URL;
    parsed_url = urlparse(url)
    domain      = parsed_url.netloc
    path        = parsed_url.path
    query       = parsed_url.query
    fragment    = parsed_url.fragment

    features = {}

    # Calculate FO: Type of URL (0=Legitimate,1=Phishing);
    # for training this should be set to something. not needed for other stuff though so gonna ignore

    # Calculate F1: Length of URL:
    F1 = len(url)
    features[column_titles[0]] = F1

    # Calculate F2: Number of dots in URL:
    F2 = url.count('.')
    features[column_titles[1]] = F2

    # Calculate F3: Repeated digits in URL;
    F3 = has_repeating_digits(url)
    features[column_titles[2]] = int(F3)

    # Calculate F4: Number of digits in URL;
    F4 = num_digits(url)
    features[column_titles[3]] = F4

    # Calculate F5: Number of special characters in URL;
    special_chars = string.punctuation
    F5 = sum(v for k, v in ct.Counter(url).items() if k in special_chars)
    features[column_titles[4]] = F5

    # Calculate F6: Number of hyphens in URL:
    F6 = url.count('-')
    features[column_titles[5]] = F6

    # Calculate F7: Number of underscores in URL:
    F7 = url.count('_')
    features[column_titles[6]] = F7

    # Calculate F8: Number of slashes in URL:
    F8 = url.count('/')
    features[column_titles[7]] = F8

    # Calculate F9: Number of question marks in URL
    F9 = url.count('?')
    features[column_titles[8]] = F9

    # Calculate F10: Number of equal signs in URL;
    F10 = url.count('=')
    features[column_titles[9]] = F10

    # Calculate F1l: Number of at symbols in URL:
    F11 = url.count('@')
    features[column_titles[10]] = F11

    # Calculate F12: Number of dollar signs in URL;
    F12 = url.count('$')
    features[column_titles[11]] = F12

    # Calculate F13: Number of exclamation marks in URL;
    F13 = url.count('!')
    features[column_titles[12]] = F13

    # Calculate F14: Number of hashtag symbols in URL;
    F14 = url.count('#')
    features[column_titles[13]] = F14

    # Calculate F15: Number of percent symbols in URL;
    F15 = url.count('%')
    features[column_titles[14]] = F15

    # Calculate F16: Length of domain;
    F16 = len(domain)
    features[column_titles[15]] = F16

    # Calculate F17: Number of dots in domain:
    F17 = domain.count('.')
    features[column_titles[16]] = F17

    # Calculate F18: Number of hyphens in domain;
    F18 = domain.count('-')
    features[column_titles[17]] = F18

    # Calculate F19: Special characters in domain:
    num_special_char_in_domain = sum(v for k, v in ct.Counter(domain).items() if k in special_chars)
    F19 = 0

    if num_special_char_in_domain > 0:
          F19 = 1

    features[column_titles[18]] = F19

    # Calculate F20: Number of special characters in domain;
    F20 = num_special_char_in_domain
    features[column_titles[19]] = F20

    # Calculate F21: Digits in domain;
    F21 = has_numbers(domain)
    features[column_titles[20]] = int(F21)
    # Calculate F22: Number of digits in domain;
    F22 = num_digits(domain)
    features[column_titles[21]] = F22

    # Calculate F23: Repeated digits in domain;
    F23 = has_repeating_digits(domain)
    features[column_titles[22]] = int(F23)

    # Calculate F24: Number of subdomains;
    subdomain = tldextract.extract(url).subdomain
    F24 = subdomain.count('.') + 1
    features[column_titles[23]] = F24

    # Calculate F25: Dot in subdomain;
    F25 = 0
    if (subdomain.count('.') > 0):
          F25 = 1
    features[column_titles[24]] = F25

    # Calculate F26: Hyphen in subdomain;
    F26 = 0
    if (subdomain.count('-') > 0):
          F26 = 1
    features[column_titles[25]] = F26

    # Calculate F27: Average subdomain length;
    subdomains = subdomain.split('.')
    total = 0
    for i in range(0, len(subdomains)):
        total += len(subdomains[i])
    
    F27 = 0
    if len(subdomains) != 0:
        F27 = total / len(subdomains)

    features[column_titles[26]] = F27


    # Calculate F28: Average number of dots in subdomain;
    F28 = 0 # this section of the data set is weird as its always 0
    features[column_titles[27]] = F28

    # Calculate F29: Average number of hyphens in subdomain;
    total = 0
    for i in range(0, len(subdomains)):
        total += subdomains[0].count('-')

    F29 = 0
    if len(subdomains) != 0:
        F29 = total / len(subdomains)
    features[column_titles[28]] = F29

    # Calculate F30: Special characters in subdomain;
    num_special_characters_in_subdomain =sum(v for k, v in ct.Counter(subdomain).items() if k in special_chars)
    F30 = 0

    if num_special_characters_in_subdomain > 0:
          F30 = 1

    features[column_titles[29]] = F30

    # Calculate F31: Number of special characters in subdomain:
    F31 = num_special_characters_in_subdomain
    features[column_titles[30]] = F31

    # Calculate F32: Digits in subdomain;
    F32 = has_numbers(subdomain)
    features[column_titles[31]] = int(F32)

    # Calculate F33: Number of digits in subdomain;
    F33 = num_digits(subdomain)
    features[column_titles[32]] = F33

    # Calculate F34: Repeated digits in subdomain;
    F34 = has_repeating_digits(subdomain)
    features[column_titles[33]] = int(F34)

    # Calculate F35: Presence of path;
    F35 = 0
    if len(path) > 0:
        F35 = 1
    features[column_titles[34]] = F35

    # Calculate F36: Length of path;
    F36 = len(path)
    features[column_titles[35]] = F36

    # Calculate F37: Presence of query;
    F37 = 0
    if len(query) > 0:
        F37 = 1
    features[column_titles[36]] = F37

    # Calculate F38: Presence of fragment:
    F38 = 0
    if len(fragment) > 0:
        F38 = 1
    features[column_titles[37]] = F38

    # Calculate F39: Presence of anchor;
    F39 = 0
    if url.count('#') > 0:
        F39 = 1
    features[column_titles[38]] = F39

    # Calculate F40: Entropy of URL=P; * logP::
    F40 = shannon_entropy(url)
    features[column_titles[39]] = F40

    # Calculate F41: Entropy of domain=P; * log2P,
    F41 = shannon_entropy(domain)
    features[column_titles[40]] = F41

    return features


# url = "https://becomingthejoat.co/admin/index.php"
# url2 = "https://www.angelfire.com/goth/devilmay
# extract_features(url2)

def main(args):
    if len(args) == 0:
        exit(-1)
    
    url = args[0]
    features = extract_features(url)
    #print(f'features: {features}')

    data = [features]
    dataframe = pd.DataFrame.from_dict(data)
    dataframe = dataframe.drop(['average_number_of_dots_in_subdomain', 'having_special_characters_in_subdomain', 'having_hyphen_in_subdomain', 'having_dot_in_subdomain', 'having_repeated_digits_in_subdomain', 'having_path', 'average_number_of_hyphens_in_subdomain'], axis=1)
    #print(dataframe)

    model_pkl_file = "random_forest_model.pkl"

    # load model from pickle file
    with open(model_pkl_file, 'rb') as file:  
        model = pickle.load(file)

    prediction = model.predict_proba(dataframe)

    # print the probability that the website is phishing
    print(prediction[0][1])


if __name__ == '__main__':
    main(sys.argv[1:])
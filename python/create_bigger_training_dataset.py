import pandas as pd
import feature_extraction as fe
from alive_progress import alive_bar

# comment denotes what value means
datasets = ["Dataset.csv",   # phishing = 1
            "PhishBenignDataset.csv"] # 0 = not phishing, 1 = phising

columns_to_extract = [[],
                      ["URL", "label"],
                      ["url", "type"]]

def make_dataset():
    df = pd.read_csv(datasets[0])

    list_of_dics = []
    tmp_df = pd.read_csv(datasets[1])

    tmp_df_first = tmp_df
    tmp_df_second = tmp_df

    tmp_df_first['url'] = tmp_df_first['url'].apply(lambda x: "https://" + x)
    tmp_df_second['url'] = tmp_df_second['url'].apply(lambda x: "htts://" + x)

    tmp_df = pd.concat([tmp_df_first, tmp_df_second])

    columns = []
    for column_name in columns_to_extract[2]:
        columns.append(tmp_df[column_name].tolist())

    print(f'Converting URLs to features for {datasets[1]}')
    with alive_bar(len(columns[0])) as bar:
        for i, url in enumerate(columns[0]):
            tmp_dic = fe.extract_features(url)
            tmp_dic["Type"] = columns[1][i]

            list_of_dics.append(tmp_dic)
            bar()

    df_4 = pd.DataFrame.from_dict(list_of_dics)

    df_final = pd.concat([df, df_4])

    # filter out urlss that do not have a valid schemee (this makes the entropy of domain 0 as the urlparse fails)
    mask = df_final['entropy_of_domain'] == 0.0
    df_final = df_final[~mask]

    print(df_final)
    print('Saving to csv')
    df_final.to_csv('training_dataset.csv', index=False)

def main():
    make_dataset()

if __name__ == '__main__':
    main()
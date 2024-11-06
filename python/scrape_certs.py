import selenium
import selenium.webdriver
import time
from bs4 import BeautifulSoup

TRUSTED_CERTS_URL: str = 'https://support.apple.com/en-us/105116'

# Setting up Chrome OPTIONS
OPTIONS = selenium.webdriver.ChromeOptions()
user_agent: str = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.50 Safari/537.36'
OPTIONS.add_argument(f'user-agent={user_agent}')
OPTIONS.add_argument("--headless=new")
DRIVER = selenium.webdriver.Chrome(options=OPTIONS)

def get_ca_certs() -> list[tuple[str, str]]:
    DRIVER.get(TRUSTED_CERTS_URL)
    time.sleep(5)
    soup = BeautifulSoup(DRIVER.page_source, 'html.parser')

    table = soup.find_all('tr')
    cert_list: list = []
    for entry in table:
        try:
            cols = entry.decode_contents().split('<p')[1:3]
            cert_list.append(cols[0].split('</p>')[0].split('">')[1].strip() + "___" + cols[1].split('</p>')[0].split('">')[1].strip())
        except: pass

    return cert_list

if __name__ == "__main__":
    try:
        with open('certs.txt', 'w', encoding='utf8') as f:
            f.write("\n".join(get_ca_certs()))
    except Exception as e:
        print(e)
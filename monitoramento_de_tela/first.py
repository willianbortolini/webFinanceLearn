import pyautogui, os
from time import sleep
import requests

#configuração do caminho

cwd = os.getcwd() #diretorio raiz
caminho = cwd + '\monitoramento_de_tela\imagens'#cwd + '\imagens'
print("caminho="+caminho)
os.chdir(caminho)

arquivo = 'teste.PNG'
logo = 'logo.PNG'
#variaveis de controle
k = 0
n = 20 

while True:

    if k >= n:
        print('imagem não encontrada')
        break

    #procura a imagem
    local = pyautogui.locateCenterOnScreen(arquivo)
    ProgramaAberto = pyautogui.locateCenterOnScreen(logo)

    if ProgramaAberto:
        print("programa aberto")

    if local != None:
        #requisicao = requests.get('https://w9b2.com/Envios/Inserir?id=12121&valor1=%221&valor2=0%22&data=&aviso=&vercao=2')
        print(requisicao.json())
        print("imagem encontrada")
        break


    sleep(0.5)
    k +=1
    print(k)    
    #se tentar 



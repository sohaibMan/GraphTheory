# Theorie des graphes

# À quoi sert cette l'application ?

   Cette application est faite pour rendre votre vie plus facile lorsque vous traitez des graph et des algorithmes sur des graphs, il couvre une variété d’algorithmes tels que BFS  DFS Dijkstra Prime Kosaraju bellman-ford, et il vous donne le résultat d’un algorithme sur un graph sous forme d’un grpah

**[Code Source:](https://github.com/sohaibMan/GraphTheory.git)** 

[GitHub - sohaibMan/GraphTheory: Graph theory is the study of graphs that concerns with the relationship among edges and vertice, and in this project I have implement a various number of algorithmes such as bfs dfs dijkestra ... and I made a UI to interacte with them](https://github.com/sohaibMan/GraphTheory.git)

# Comment ça marche ?

   Cette application est une application web réalisée avec l’architecture REST ( client ,serveur) avec Flask (Python) + Networkx (pour la gestion des graphs)+ Matplotlib(Dessin des graphs) en back end et NextJs + React  +TypeScript + Regex (valider l’entrée utilisateur) + React Query (gestion de l’état de l’application) pour le front end et le docker pour le déploiement 

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled.png)

# Comment l’installer ?

```bash
git clone https://github.com/sohaibMan/GraphTheory.git

cd GraphTheory

####################################
## for docker users
####################################
docker compose up
## to stop it 
docker compose down
## to build it
docker compose up --build

####################################
## to runt locally without docker(if you don't have docker installed)
####################################
## install the dependencies (front end)
cd nextjs && npm i 
## install the dependencies (backend end)
cd ../flask && pip3 install -r requirements.txt
## note if u run on linux you need to give the app permission to write and read and delete to tmp_output folder if needed
chmod 770 tmp_output 
## run the back end
python3 server.py
## run the front end
cd ../next && npm run dev
## now open http://localhost:3000 in your browser
```

# Comment utiliser l'application ?

    Cette application est conviviale et très simple à utiliser , il suffit de suivre ces étapes pour l’utiliser

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%201.png)

1- **Dessiner pour voir votre graphique**

vous avez cette zone de texte pour taper vos bords et nœuds de graphique dans ce format

noeud arête le poids (poids est facultatif)

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%202.png)

**Example :**

- **A B 2** sera  interprété comme on a 2 noeuds A  et B et un arrete A→ B de poids 2 (avec ordre)

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%203.png)

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%204.png)

- 1
    
    2 
    
    3
    
     sera  interprété  comma on a 3 noeuds 1 2 3 
    

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%205.png)

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%206.png)

2- choisir un algorithme pour l’appliquer et saisir les valeurs requises

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%207.png)

**Astuces:**

- Pour Changer l’orientation du graph clicker sur l’un des buttons:

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%208.png)

- si le graph n’est pas bien dessiné, vous pouvez le redessiner à l’aide de ce bouton

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%209.png)

## E**xample de l’algorithme de Dijkstra :**

**Definition:** L’algorithme de Dijkstra est un algorithme pour trouver les chemins les plus courts entre les nœuds dans un graphique pondéré

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2010.png)

**Les Etapes :**

1. **Représentation graphique sous forme d'une liste**

**Notes** : Nous supposons que le nœud A est 1 B est 2 et vice versa

```
A B 7 
A C 1
B D 4
B F 1
C B 5
C E 2
C F 7
E D 5
E B 2
F E 3

```

**L’interface**

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2011.png)

1. le choix d’un nœud de départ et noe d'extrémité 

**Exemple: A,D** 

![a5c76267-cb91-4b88-950e-b1b1dbd01993.png](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/a5c76267-cb91-4b88-950e-b1b1dbd01993.png)

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2012.png)

**Explication:**

- le chemin le plus court entre A et D est A→C→E→D avec le cout total 8

**Exemple:** E,F

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2013.png)

**Explication:**

- le chemin le plus court entre E et F est E→B→F avec le cout total 3

**Exemple** : D,A

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2014.png)

**Explication:**

- il ya pas de chmen entre D  et A

## **Example de l’algorithme de BFS / DFS:**

pronouns par exemple le graph suivante: (graph simple  orienté pondéré)

```
A B 
B C 
B D 
A D
D E
B E 
C A
```

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2015.png)

**Exemple BFS a partier de A**

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2016.png)

**Exemple BFS a partier de E**

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2017.png)

**Exemple DFS a partier de D**

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2018.png)

**Exemple DFS a partier de C**

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2019.png)

## **Example de l’algorithme de prime:**

   pronouns par exemple le graph suivante: (graph simple  not orienté pondéré)

```

6 1 10
1 2 28
2 3 16
3 4 12
4 5 22
5 6 24
4 7 18
5 7 24
7 2 14
```

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2020.png)

**Explication:** en arrière-plan, l’algorithme fait les prochaines étapes

![prims-algorithm-java.png](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/prims-algorithm-java.png)

## **Example de l’algorithme de kosarajus:**

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2021.png)

**Explication:**

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2022.png)

## **Example de l’algorithme de** *bellman Ford:*

**Example :**

```
0 1 1
0 2 4
1 4 7
1 3 2
1 2 -2
2 3 3
3 4 4
4 5 7
5 3 -3
```

*source=0*

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2023.png)

**Explication:**

![Untitled](Theorie%20des%20graphes%20bfce2479b0114de48305c901e2c6ef4b/Untitled%2024.png)
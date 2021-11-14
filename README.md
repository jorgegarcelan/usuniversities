# usuniversities
---
title: "Unsupervised Learning project - Universities in the US"
subtitle: "Statistical Learning - UC3M"
author: "Jorge Garcelán Gómez"
date: "30/10/2021"
output: 
  html_document:
      theme: readable
      code_folding: show
      number_sections: true
      toc: true
      toc_depth: 3
      toc_float:
            collapsed: true
            smooth_scroll: false

editor_options:
  chunk_output_type: console
---

```{r global_options, include=T, echo = F}
knitr::opts_chunk$set(echo = T, warning=FALSE, message=FALSE)
```

```{r echo=FALSE}
setwd("C:/Users/jorge/Desktop/UNI/2-SEGUNDO/2-1-STATISTICS/HOMEWORK/College")
```


```{r echo=FALSE}
# clean the workspace:
rm(list=ls())
```

The objectives of this work is to analyze data from universities in the US by applying unsupervised learning techniques, such as PCA, FA and clustering. Our intentions with the project is that we could separate observations, *i.e.* universities, according to the type (public/private) or even to how good the university is. This would gave us a wider look and, hopefully, a better understanding of the post-secondary education in the United States.  


# Data: 

I have considered a dataset that can be found in the web of the Integrated Postsecondary Education Data System, IPEDS. This dataset was also considered in the USNEWS for the ASA Statistical Graphics Section's of 1995 Data Analysis Exposition. This dataset contains information on over 1000 American colleges and universities. The dataset can be found in the following link: <https://nces.ed.gov/ipeds/datacenter/InstitutionByGroup.aspx>. The following variables have been considered:  


Variable         | Information
---------------- | ------------
FICE             | Federal ID number
X                | College name
State            | Postal code of the state
Public/private   | Indicator of public=1, private=2
Av_Math_SAT      | Average Math SAT score
Av_Verbal_SAT    | Average Verbal SAT score
Av_Comb_SAT      | Average Combined SAT score
Av_ACT_score     | Average ACT score
1Q_Math_SAT      | First quantile - Math SAT
3Q_Math_SAT      | Third quantile - Math SAT
1Q_Verbal_SAT    | First quantile - Verbal SAT
3Q_Verbal_SAT    | Third quantile - Verbal SAT
1Q_ACT           | First quantile - ACT
3Q_ACT           | Third quantile - ACT
Apps             | Number of applications received
Accepted         | Number of applicants accepted
Enrolled         | Number of new students enrolled
Top10perc        | Pct. new students from top 10% of H.S. class
Top25perc        | Pct. new students from top 25% of H.S. class
Full_Under       | Number of fulltime undergraduates
Part_Under       | Number of parttime undergraduates
In-state         | In-state tuition
Out-of-state     | Out-of-state tuition
Room_board       | Room and board costs
Room             | Room costs
Board            | Board costs
Fees             | Additional fees
Book             | Estimated book costs
Personal         | Estimated personal spending
Faculty_PhD      | Pct. of faculty with Ph.D.'s
Faculty_Terminal | Pct. of faculty with terminal degree
SF_Ratio         | Student/faculty ratio
Perc_Donate      | Pct.alumni who donate
Instructional    | Instructional expenditure per student
Grad_Rate        | Graduation rate


```{r}
data = read.csv("collegedata.csv", header = F, sep = ",", na.strings = "*")
```

# Data Preprocessing:  

Before starting with the models we need to explore and modify the dataset in order to have a nice and clean input.

## Librarires:
```{r}
library(tidyverse)
library(leaflet)
library(rgdal)
library(stringr)
library(htmltab)
library(GGally)
library(factoextra)
library(fastDummies)
library(ggplot2)
library(cluster)
```


## Discard not interesting variables:  

Once we have the data loaded, we are going to change the names of the variables and discard some of them that are not interesting for the project:

```{r}
colnames(data) = c("FICE","X","State","Public_Private","Av_Math_SAT","Av_Verbal_SAT","Av_Comb_SAT","Av_ACT_score","1Q_Math_SAT","3Q_Math_SAT","1Q_Verbal_SAT","3Q_Verbal_SAT","1Q_ACT","3Q_ACT","Apps","Accepted","Enrolled","Top10perc","Top25perc","Full_Under","Part_Under","In_State","Out_State","Room_Board","Room","Board","Fees","Books","Personal","Faculty_PhD","Faculty_Terminal","SF_Ratio","Perc_Donate","Instructional","Grad_Rate")
data = data %>% select(-c(1,5,6,7,8,9,10,11,12,13,14))
```

Now, we take a look at the types of the variables we have, just in case we need to make modifications. In this case we check that all variables have the right type except **X** and **Public\_Private**, that need to be factors. However, they are going to be changed later in the **Profiles** section.

Hence, now we are going to discard **Room** and **Board** variables because there exists already a variable, **Room\_Board**, that is the sum of them. Moreover, we are going to delete **Top10perc** as people in there is obviously included in **Top25perc**. This is done in order to avoid correlations later.

```{r}
str(data)

data$Room = NULL
data$Board = NULL
data$Top10perc = NULL
```

## Missing Values, NAs:  
We check whether if the data have missing values (NAs) or not, and where. First, we are going to create a copy, **full\_data**, of **data** in order to compare later some values.  

```{r echo=FALSE}
full_data = data
library(VIM)
```

Next, using the **VIM** package we can see in a graph the distribution of NAs and the missing values for each variable. We see that in 4 variables the percentage of missing data is around 10-20% but in others lower than 5%. For this reason, we can consider a threshold (for example the value for **Grad\_Rate**, because from there the distribution is more stable) for removing observations that are NA regarding the variables which percentage of NA is higher than that threshold.  
```{r}
# plot of NAs:
na_plot = aggr(data, col=c('#69b3a2','red'), numbers=TRUE, sortVars=TRUE, labels=names(data), cex.axis=.7, gap=3, ylab=c("Histogram of NAs","Pattern"))
```

These variables are **Fees**, **Perc\_Donate**, **Top25perc** and **Personal**. However, **Personal** is not consider because once we have deleted rows of **Top25perc** and **Perc\_Donate**, the proportion of NA is below the considered threshold. It is important to consider that variable **Fees** is going to be part of a new variable, **TotalCost**, and its contribution to it is small. For this reason, we are going to use **MICE** to estimate the missing values. Moreover, if we omit the corresponding observations we are going to lose information of a lot of important universities.  
```{r}
# delete NAs of Top25perc and Perc_Donate:
data = data[!is.na(data$Top25perc),]
data = data[!is.na(data$Perc_Donate),]

# new plot of NAs:
na_plot = aggr(data, col=c('#69b3a2','red'), numbers=TRUE, sortVars=TRUE, labels=names(data), cex.axis=.7, gap=3, ylab=c("Histogram of NAs","Pattern"))
```

Before using **MICE**, we are going to consider a new variable, **Acc\_Rate**, that would be of interest in order to eliminate correlations between **Apps** and **Accept**, and to catalog later the universities. This is also done here in order to avoid **Acc\_Rate** to be $>$ 1 due to predictions of **Apps** and **Accept**. Obviously, we delete **Apps** and **Accept**.  

```{r}
data$Acc_Rate = data$Accepted/data$Apps
data$Accepted = NULL
data$Apps = NULL
```

We have different options in order to handle this NAs. But, as anticipated, we are going to give values to them by using the "Multiple Imputation" technique (MICE), in order to capture a better sample variability.  
```{r echo=FALSE}
library(mice)
```

```{r results='hide'}
# model:
mice = mice(data, method = 'rf')
mice.com = mice::complete(mice)
```

```{r}
# variables that have NAs:
data$Personal = mice.com$Personal
data$Grad_Rate = mice.com$Grad_Rate
data$Room_Board = mice.com$Room_Board
data$Part_Under = mice.com$Part_Under
data$Faculty_PhD = mice.com$Faculty_PhD
data$In_State = mice.com$In_State
data$Room_Board = mice.com$Room_Board
data$Out_State = mice.com$Out_State
data$Instructional = mice.com$Instructional
data$Books = mice.com$Books
data$Faculty_Terminal = mice.com$Faculty_Terminal
data$Fees = mice.com$Fees
data$Enrolled = mice.com$Enrolled
data$Acc_Rate = mice.com$Acc_Rate

# plot without NAs
na_plot = aggr(data, col=c('#69b3a2','red'), numbers=TRUE, sortVars=TRUE, labels=names(data), cex.axis=.7, gap=3, ylab=c("Histogram of NAs","Pattern"))
```

A natural question to ask is: Have sense the values predicted by MICE?. For this reason, we would make a comparison of the values of **Fees** (that is why we created previously **full_data**), because it was the variable with highest percentage of NAs, with and without MICE.  
```{r echo=FALSE}
library(ggpubr)
```

```{R}
# fees with MICE:
fees_mice = ggplot() + geom_boxplot(aes(x=data$Fees, color="red")) + theme(legend.position="none")

# fees without MICE:
fees_Nmice = ggplot() + geom_boxplot(aes(x=full_data$Fees)) +
    theme(legend.position="none")

# both plots:
comb_plot = ggarrange(fees_mice, fees_Nmice,
                    labels = c("Values of Fees with MICE", "Values of Fees in original dataset without MICE"),
                    ncol = 1, nrow = 2); comb_plot
```

We see that values are similar, so the imputation with MICE is acceptable.  


## Non-Reasonable values:  
Let´s get a wider look of the data by using the summary command.  
```{r}
summary(data)
```

We see that in **PhD** and **Grad\_Rate** we have maximum values that exceed 100, and because the variables are percentages, we can discard those observations from the data.  
```{r}
data = data %>% filter(data$Faculty_PhD<=100 & data$Grad_Rate<=100)
```


## Duplicates:
Now that the data have reasonable values, so we are going to look for any duplicated rows, and if so, discard them:  
```{r}
# duplicated colleges:
table(data$X)[which(table(data$X)>1)]

# cleaned data:
data = data %>% distinct(X, .keep_all = T)
```


## Profiles:
Last thing to consider before starting with the models is that we are going to store some variables as profiles, in order to later interpret better the models and to have the dataset with numeric variables. Those variables are **X**, **Public\_Private** and **State**. Moreover, we are going to create a profile of how **Elite** is a college: 

```{r}
# college names:
data$X = as.factor(data$X)
row.names(data) = data$X
college.names = data$X
data$X = NULL

# public/private:
college.pub_priv = data$Public_Private

# states:
college.states = data$State
data$State = NULL
par(mfrow = c(1, 2))
barplot(table(college.states), col="#69b3a2", main="Distribution of Universities per State")
barplot(table(college.pub_priv), col="#69b3a2", main="Distribution of Universities per Type", sub = "1: Public / 2: Private")
```

We would consider that elite universities have **Top25perc** \>= 0.95 and **Acc_Rate** \< 0.40 (as they can be represented as outliers in the boxplot). That would tell us that being accepted in that universities is very hard and exclusive, and that the students are at least in the third quantile of best students in the country.  
```{r}
par(mfrow = c(1, 2))
boxplot(data$Acc_Rate, col="#69b3a2", main = "Acc_Rate boxplot")
boxplot(data$Top25perc, col="#69b3a2", main = "Top25perc boxplot")


# elite universities:
getElite = function(df){
  vector = c()
  for (i in 1:nrow(df)){
    if (data$Acc_Rate[i] <= 0.40 & data$Top25perc[i] >= 90){
      vector[i] = 1
    }
    else{
      vector[i] = 0
    }

  }
  vector
}
college.elite = getElite(data)
barplot(table(college.elite), col="#69b3a2", main="Elite universities", sub = "0: Not Elite / 1: Elite")
```

Also, we are going to consider another profile, **Region**, that groups states in regions in the US, as established by the *U.S. Census Bureau* (https://www2.census.gov/geo/pdfs/maps-data/maps/reference/us_regdiv.pdf).  
```{r}
# regions:
groupUS = function(states){
  for (i in 1:length(states)){
    if (states[i] %in% c("CA", "OR", "WA", "NV", "ID", "MT", "WY", "UT", "CO", "AZ", "NM", "HI", "AK")){
      states[i] = "West"
    }
    
    if (states[i] %in% c("PA", "NJ", "NY", "VT", "RI", "MA", "NH", "ME", "CT")){
      states[i] = "NorthEast"
    }
    if (states[i] %in% c("TX", "OK", "AR", "LA", "MS", "AL", "TN", "KY", "WV", "DE", "MD", "DC", "VA", "NC", "SC", "GA", "FL")){
      states[i] = "South"
    }
    if (states[i] %in% c("IL", "IN", "MI", "OH", "WI", "IA", "KS", "MN", "MO", "NE", "ND", "SD")){
      states[i] = "North-Central"
    }
    
  }
  states
}
college.regions = groupUS(college.states)
barplot(table(college.regions), col="#69b3a2")

library(usmap)
# maps of regions:
west_plot = usmap::plot_usmap(include = .west_region, labels = TRUE, fill = "red", alpha = 0.25)
south_plot = usmap::plot_usmap(include = .south_region, labels = TRUE, fill = "orange", alpha = 0.25)
northcentral_plot = usmap::plot_usmap(include = .north_central_region, labels = TRUE, fill = "green", alpha = 0.25)
northeast_plot = usmap::plot_usmap(include = .northeast_region, labels = TRUE, fill = "blue", alpha = 0.25)

# combined regions plot:
regions_plot = ggarrange(west_plot, south_plot, northcentral_plot, northeast_plot,
                    labels = c("West", "South", "North-Central", "North-East"),
                    ncol = 4, nrow = 1, align = "v"); regions_plot
```



## New variables:

It is interesting to consider the total cost (we will assume per semester) as it is done in the following notebook https://www.kaggle.com/lunamcbride24/college-exploration-and-regression. This would give us a better understanding later on when we apply unsupervised learning techniques. But first, it is important to notice that **Outstate** and **Instate** cannot be added at the same time. For this reason, we are going to consider the mean. As expected, variables that forms the **TotalCost** variable are removed.  

- Total Cost:  
```{r}
# new variable:
getTotalCost = function(df){
  cost = c()
  for (row in 1:nrow(df)){
    cost[row] = sum(mean(df$Out_State[row], df$In_State[row]), df$Room_Board[row], df$Books[row], df$Personal[row], df$Fees[row])
  }
  cost
}

data$TotalCost = getTotalCost(data)

# remove variables:
data$In_State = NULL
data$Out_State = NULL
data$Room_Board = NULL
data$Fees = NULL
data$Books = NULL
data$Personal = NULL
```

Also we are going to consider another variable, **Total_Under**, that refers to the number of Full time undergraduates, **Full_Under**, and part time undergraduates, **Part_Under**:  

- Total Undergraduates:  
```{r}
# new variable:
getTotalUnder = function(df){
  under = c()
  for (row in 1:nrow(df)){
    under[row] = sum(df$Full_Under[row], df$Part_Under[row])
  }
  under
}

data$Total_Under = getTotalUnder(data)

# remove variables:
data$Full_Under = NULL
data$Part_Under = NULL
```


## Outliers:
It is important to detect properly the **outliers**. For this reason, it is better to use box plots. We see that in **Acc_Rate**, **Enrolled**, **Instructional** and **Total_Under** we have many outliers. However, the decision after several tests is to keep them because they are colleges that somehow are going to be useful in order to group and rank universities.  
```{r}
data %>%
  as.tibble() %>%
  gather(variable, value) %>%
  ggplot(aes(x=value)) +
    geom_boxplot(fill= "#69b3a2") + facet_wrap(~variable, scale="free")
```

## Public/Private variable:
Before creating the models, we are going to create a copy of **data** that will not contain the **Public/Private** variable, in order to compare results of the outputs of the models.  
```{r}
# data without Public/Private:
out_data = data %>% select(-1)
```


# Exploratory Data Analysis:

It is highly important to dedicated some time in exploring the variables we have in our dataset before starting with the models.  
```{r}
summary(data)
```

```{r}
data %>%
  as.tibble() %>%
  gather(variable, value) %>%
  ggplot(aes(x=value)) +
    geom_histogram(fill= "#69b3a2") + facet_wrap(~variable, scale="free")
```

We can see that variability across the variables is highly different. In **Instructional** and **Enrolled** is low but in **Grad_Rate** and **Top25perc** is high. This points out that they could be good variables to rank observations. We can also see that the maximum of **Acc_Rate** is 1, which is surprising as every student is accepted.  



# PCA:  
**Principal Component Analysis** is an Unsupervised Learning tool that will let us reduce dimensionality of the variables.   

##  Data with Public/Private:  

We have seen previously that values are highly spread (percentages, ratios, total cost, etc...) so we are going to scale the data. PCA is going to maximize the variance in order to rank observations.  

```{r}
boxplot(scale(data), las=2, col="#69b3a2")
```

### Correlations:  
It is important to consider the correlation matrix in order to see hide correlations.  

```{r}
library(GGally)
ggcorr(data, label = T)
```

As expected, **Faculty_Terminal** and **Faculty_PhD** have a strong correlation basically because people with PhD are also considered as people with terminal degree. The same happens with **Enrolled** and **Total_Under**. For this reason, we are not going to consider **Faculty_PhD** and **Enrolled**. We also see some natural strong correlations such as **Instructional** and **TotalCost** (if the spend by the college is high, the total cost would be higher), and also but negative, **Total_Under** and **Public/Private** (public universities may have more students).  
```{r}
data$Enrolled = NULL
data$Faculty_PhD = NULL
ggcorr(data, label = T)
```

### Model:  
```{r}
# model:
pca = prcomp(data, scale=T)
summary(pca)
```

Checking the screeplot, we notice that around 60% of total variance is explained by the two first components. This would we sufficient for our intentions. For this reason, we have only considered two components.  
```{r}
fviz_screeplot(pca, addlabels = TRUE, barfill = "#69b3a2", barcolor = "#69b3a2")
```

We can also see a plot with the loadings and notice that we may have two differentiated clusters. But which are them? We could guess that are public and private universities, but later we would confirm it.  
```{r}
library(ggfortify)
pca_plot = autoplot(pca, data = data,
         label = TRUE, label.size = 3, shape = FALSE,
         loadings = TRUE, loadings.colour = 'blue',
         loadings.label = TRUE, loadings.label.size = 5)

library(plotly)
plotly::ggplotly(pca_plot)
```

**First component:**  

> How **good** is a University  

```{r}
fviz_contrib(pca, choice = "var", axes = 1, fill = "#69b3a2", color = "#69b3a2")
```

A minus sign is included just to better understand the plot:  
```{r}
barplot(-pca$rotation[,1], las=2, col="#69b3a2")
```

In this plot we need to interpret as usual the signs. So the value is lower if the bar is more negative, and the other way. **SF_Ratio**, **Acc_Rate** and **Total_Under** have different signs. This tell us what we should have in mind: a low value of **SF_Ratio** means that teaching is more personal as there are few students per teacher. Moreover, small values of **Acc_Rate** and **Total_Under** mean that getting accepted in the college is highly difficult so there are a small number of students in the university.

However, values of **TotalCost**, **Instructional**, **Grad_Rate**, **Top25perc** and the rest of the variables are high. This tell us that the total cost of a semester is high, the percentage of students in the top 25% is also high, as well as the graduation rate.  

Taking all of this into account, we see that this features are those that can be associated to *"Better Universities"*.  So, in this first PC, we can rank the universities with a sense of how good is that college.  

*Top 25 Universities:*  
```{r}
head(college.names[order(pca$x[,1])], 25)
```
*Bottom 25 Universities:*  
```{r}
tail(college.names[order(pca$x[,1])], 25)
```

**Second component:**  

> How **demanding/popular and public** is a University  

```{r}
fviz_contrib(pca, choice = "var", axes = 2, fill = "#69b3a2", color = "#69b3a2")
```

```{r}
barplot(pca$rotation[,2], las=2, col="#69b3a2")
```
We see that variables **Total_Under** and **Public/Private** are the most important in this second PC. however, the signs are different. This tell us that the number of students in a college is crucial in this PC, and the **Public/Private** interpretation could be how public the university is.  

For this reasons, this second PC indicates how demanding/popular and public a university is. So, now we can rank the universities by their second PC scores:  

*Most demanding Universities:*  
```{r}
head(college.names[order(pca$x[,2])], 25)
```
*Least demanding Universities:*  
```{r}
tail(college.names[order(pca$x[,2])], 25)
```


## Data without Public/Private:  

Once we have computed PCA considering the **Public/Private** variable, we could do the same but not considering it:  

### Correlations:  
It is important to consider the correlation matrix in order to see hide correlations.  

```{r}
library(GGally)
ggcorr(out_data, label = T)
```

As expected, **Faculty_Terminal** and **Faculty_PhD** have a strong correlation basically because people with PhD are also considered as people with terminal degree. The same happens with **Enrolled** and **Total_Under**. For this reason, we are not going to consider **Faculty_PhD** and **Enrolled**.  
```{r}
out_data$Enrolled = NULL
out_data$Faculty_PhD = NULL
ggcorr(out_data, label = T)
```

### Model:  
```{r}
# model:
pca_out = prcomp(out_data, scale=T)
summary(pca_out)
```

```{r}
fviz_screeplot(pca_out, addlabels = TRUE, barfill = "#69b3a2", barcolor = "#69b3a2")
```

```{r}
library(ggfortify)
pca_plot = autoplot(pca_out, data = out_data,
         label = TRUE, label.size = 3, shape = FALSE,
         loadings = TRUE, loadings.colour = 'blue',
         loadings.label = TRUE, loadings.label.size = 5)

library(plotly)
plotly::ggplotly(pca_plot)
```
We can see that observations are not as separated as with the Public/Private variable. This is because now what is more important is **Total_Under** and we have seen previously in *2.7.* that its variability is low, which indicates that observations are very similar in this variable.

**First component:**  

> How **good* is a University  

```{r}
fviz_contrib(pca_out, choice = "var", axes = 1, fill = "#69b3a2", color = "#69b3a2")
```

```{r}
barplot(pca_out$rotation[,1], las=2, col="#69b3a2")
```

We see that the interpretation of this first PC without **Public/Private** is the same as with **Public/Private**. 
So, again we can rank the universities by their first PC scores:  

*Top 25 Universities:*  
```{r}
head(college.names[order(pca_out$x[,1])], 25)
```
*Bottom 25 Universities:*  
```{r}
tail(college.names[order(pca_out$x[,1])], 25)
```

**Second component:**  

> How **demanding/popular* is a University:  

```{r}
fviz_contrib(pca_out, choice = "var", axes = 2, fill = "#69b3a2", color = "#69b3a2")
```

```{r}
barplot(pca_out$rotation[,2], las=2, col="#69b3a2")
```
We see that variables **Total_Under** is the most important in this second PC. This is a significant different because we have no more the **Public/Private** variable. So, this indicates how demanding or popular a university is.  
Now we can rank the universities by their second PC scores:  

*Most demanding Universities:*    
```{r}
head(college.names[order(pca_out$x[,2])], 25)
```
*Least demanding Universities:*     
```{r}
tail(college.names[order(pca_out$x[,2])], 25)
```


## Conclusion:  
Once we have done the different PCA models, we can compare them and select what configuration best suits with our goals. We see that both models are very similar in terms of the meaning of the principal components. In this case the preferred choice is:  

> Data with Public/Private, *(4.1.)*, because this variable allow us to rank universities by a quality indicator.  

# Factor Analysis:  
Factor Analysis is an analytical tool where the focus is to explain correlations between indicators (by common factors), and will be made by reducing the dimension.  

As well as with PCA, we will consider two approaches: considering the Public/Private indicator and not. Moreover, we would consider also two and three factors respectively.  

## Data with Public/Private:  

### Two Factors:  

- Rotation = "varimax", Scores="Bartlett":  
```{r}
f = 2
r = "varimax"
s = "Bartlett"
data_fa = factanal(data, factors = f, rotation=r, scores=s)
data_fa
```
We can see that the proportion of total variance that it is explained is 53%. The meaning of the First factor is how good a university is, in spite of the Second factor, that explain the popularity.

- Rotation = "none", Scores = "Regression":
```{r}
f = 2
r = "none"
s = "regression"
data_fa = factanal(data, factors = f, rotation=r, scores=s)
data_fa
```
But with this configuration also we get exactly the same total variance.  

For this reason we will consider also **three factors**. But first, let´s plot the two factors in a 2D graph just to see if there are some hidden insights:  

```{r}
fa_plot = autoplot(data_fa, label = TRUE, label.size = 3, shape = FALSE,
         loadings = TRUE, loadings.label = TRUE, loadings.label.size  = 5)
plotly::ggplotly(fa_plot)
```
It is very interesting how the plot of the **Factor Analysis** model is represented. We can see two differentiated groups that according to the loadings, correspond to the **Public_Private** indicator. Let´s check it:  

```{r}
fa_plot = autoplot(data_fa, label = TRUE, label.size = 3, shape = FALSE, colour = college.pub_priv, legend = TRUE,
         loadings = TRUE, loadings.label = TRUE, loadings.label.size  = 5)
plotly::ggplotly(fa_plot)

```

### Three Factors:  
Previously we have seen that with two factors the total variance that the model explained was around 53% (independent of the rotation and scores used). For this reason we would consider **three factors** to see if it is better.  

- Rotation = "varimax", Scores="Bartlett":  
```{r}
f = 3
r = "varimax"
s = "Bartlett"
data_fa = factanal(data, factors = f, rotation=r, scores=s)
data_fa
```
We can see that the proportion of total variance that it is explained is 59%. 

- Rotation = "none", Scores = "Regression":
```{r}
f = 3
r = "none"
s = "regression"
data_fa = factanal(data, factors = f, rotation=r, scores=s)
data_fa
```

The result is that it explain 59% of total variance, slightly higher than with two factors. Not enough to say that it is a better model than with **two factors**.  

## Data without Public/Private:  

Once we have computed the models considering the **Public/Private** variable, we could do the same but not considering it:  

### Two Factors:

- Rotation = "varimax", Scores="Bartlett": 
```{r}
f = 2
r = "varimax"
s = "Bartlett"
out_data_fa = factanal(out_data, factors = f, rotation=r, scores=s)
out_data_fa
```

- Rotation = "none", Scores="regression": 
```{r}
f = 2
r = "none"
s = "Bartlett"
out_data_fa = factanal(out_data, factors = f, rotation=r, scores=s)
out_data_fa
```

Both models explain the 50% of variance with two factors. The meaning of the **First factor** is also how **good** a university is, in spite of the **Second factor**, that explain the **popularity**.  

Let´s see the plot:  
```{r}
fa_plot = autoplot(out_data_fa, label = TRUE, label.size = 3, shape = FALSE,
         loadings = TRUE, loadings.label = TRUE, loadings.label.size  = 5)
plotly::ggplotly(fa_plot)

```
Now it is not that clear as with two factors. However, to remark something is that the observations have like a square distribution, in which the branches are determined by the most important variables in each factor, **Total_Under** and for example, **Total_Cost**.  

## Conclusion:  
We have considered 2 variations in the data (with and without Public/Private), 2 different numbers of factor (2 and 3) and 2 different configurations of rotation and scores. In total 8 different models. However, the results were very similar in terms of total variance explained. For our purpose, the choice is:

> Two factors with rotation = "varimax" and scores = "Bartlett", because variance is 53% and in the plot we saw that colleges are grouped good by a sense of **Public/Private**.  



# Clustering:
The final unsupervised learning tool that we will use in this project is **clustering**. The focus is to reduce dimensionality of observations by grouping them into clusters. The interesting and preferred thing is to maximize the distance between different clusters and minimize it between observations of the same group.  

We would consider different approaches of clustering: 
- K-Means
- Mahalanobis K-Means
- Hierarchical
- PAM
- Kernel K-Means  

First, we would load some crucial libraries for clustering:  
```{r}
library(factoextra)
library(cluster)
library(mclust)
```

## Data with Public/Private:

### K-Means:
Because clustering is a tool that uses distances, the recommendable thing to do is to scale the data.  
```{r}
X_data = scale(data)
```

It is also important to determine the number of optimal clusters. We would make some plots using *silhouette* and *WSS* methods to determine it. We see that we could choose either 2 and 3 (*gap_stat* is not considered because it is more time consuming and the results of the previous methods are acceptable).  
```{r}
fviz_nbclust(X_data, kmeans, method = "silhouette", nstart = 1000, linecolor = "#69b3a2")
```

```{r}
fviz_nbclust(X_data, kmeans, method = "wss", nstart = 1000, linecolor = "#69b3a2")
```

Before starting with the models, let´s consider the PCA plot in order to see how the observations are going to be placed and to realize the meaning with the loadings of the possible clusters:  

```{r}
library(ggfortify)
pca_plot = autoplot(pca, data = data,
         label = TRUE, label.size = 3, shape = FALSE,
         loadings = TRUE, loadings.colour = 'red',
         loadings.label = TRUE, loadings.label.size = 5)

library(plotly)
plotly::ggplotly(pca_plot)
```

#### Two clusters:  

> Above average universities vs Below average universities.  

```{r}
# K=2:
k = 2
km2 = kmeans(scale(data), center = k, nstart = 1000)
fviz_cluster(km2, data = scale(data), geom = c("point"),ellipse.type = 'norm', pointsize=1, main = "K-Means clusplot with 2 clusters")+
  theme_minimal()+geom_text(label=row.names(data),hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```

We can see that we have two differentiated groups. According to the previous interpretation in *4.1.* of the PC, we see that the two clusters are more differentiated by the first component. More to the left indicates that the college is better than the average college and the other way to the right.  

Let´s see how good are the groups:  
As we can see in both plots, groups can be considered as **good** taking into account the silhouette widths. On the other hand, they are not that well-balanced but this seems acceptable.  
```{r}
barplot(table(km2$cluster), col="#69b3a2", main = "Number of colleges per cluster", sub = " Hypothesis: 1 Above Av. / 2 Below Av.")
```

```{r}
d = dist(data, method="euclidean")  
data_sil = silhouette(km2$cluster, d)
plot(data_sil, col=1:2, main="", border=NA)
```


#### Three clusters:  

> Above average universities vs Below average public universities vs Below average private universities.  

```{r}
#K=3:
k = 3
km3 = kmeans(scale(data), center = k, nstart = 1000)
fviz_cluster(km3, data = scale(data), geom = c("point"),ellipse.type = 'norm', pointsize=1, main = "K-Means clusplot with 3 clusters")+
  theme_minimal()+geom_text(label=row.names(data),hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```

We can see that we have three differentiated groups. According to the previous interpretation in *4.1.* of the PC, we see that the interpretation of the three clusters is similar to the one with two clusters. More to the left implies that the college is better and more up indicates private.  

Let´s see how good are the groups:  
As we can see in both plots, groups can be considered also as **good** taking into account the silhouette widths. On the other hand, they are not that well-balanced but this seems acceptable as with two clusters.  

```{r}
barplot(table(km3$cluster), col="#69b3a2", main = "Number of colleges per cluster", sub = "Hypothesis: 1 Below Av. Private / 2 Below Av.Public / 3 Above Av")
```

```{r}
d = dist(data, method="euclidean")  
data_sil = silhouette(km3$cluster, d)
plot(data_sil, col=1:3, main="", border=NA)
```

### Mahalanobis K-Means:

Now, we could make a change in the input of the K-Means model: distance of the observations. In this case we would make use of the **Mahalanobis** distance. In *R* there is not a specific library or function to apply directly it, so we would need to construct it step by step:  
```{r}
S_x = cov(data) #  covariance matrix
inv_Sx = solve(S_x) # S_x^-1 (inverse of S_x)
eigen_Sx = eigen(inv_Sx)
vector_Sx <- eigen_Sx$vectors
Y = vector_Sx %*% diag(sqrt(eigen_Sx$values)) %*% t(vector_Sx) # inv_Sx^1/2
X_til = scale(data, scale = FALSE)
data_Sx = X_til %*% Y
```

#### Two clusters:

> Private universities vs Public universities  

Let´s consider first **two clusters**:  
```{r}
k = 2
km2.mahalanobis = kmeans(data_Sx, centers=k, nstart=1000)
```

In the clusplot we see that the two clusters are well differentiated. Taking into account the interpretation of the PC, we realize that actually this clusters represents private and public universities.  


```{r}
fviz_cluster(km2.mahalanobis, data, geom = c("point"),ellipse.type = 'norm', pointsize=1, main = "K-Means with Mahalanobis distance clusplot with 2 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```

This interpretation is precise as we can see in the following plot. For **cluster 1** we have that most of colleges are **Private**, and for **cluster 2** we have **Public** universities:  
```{r}
as.data.frame(X_data) %>% mutate(cluster=factor(km2.mahalanobis$cluster), names=college.names, pub_priv=college.pub_priv) %>%
ggplot(aes(x=as.factor(pub_priv), fill=as.factor(pub_priv) )) + geom_bar( ) + facet_wrap(~cluster) + scale_fill_brewer(palette = "Greens") + labs(title = "Distribution of Private (1) and Public (2) by cluster", x = "", y = "", fill = "Type (1: Public / 2: Private)") 
```


#### Three clusters:

> Above Av. Private universities vs Below Av. Private universities vs Public universities  

Let´s consider now 3 clusters and compare the results with 2 clusters:  
```{r}
k = 3
km3.mahalanobis = kmeans(data_Sx, centers=k, nstart=1000)
```

In this case the interpretation is not as easy as with two clusters.  

```{r}
fviz_cluster(km3.mahalanobis, data, geom = c("point"),ellipse.type = 'norm', pointsize=1, main = "K-Means with Mahalanobis distance clusplot with 2 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```

However, if we remember the plot with 3 clusters in *K-Means* in 6.1.1., we can see that is similar but not the same. In this case we have:  
```{r}
adjustedRandIndex(km3.mahalanobis$cluster, km3$cluster)
```



### Hierarchical Clustering:

Another clustering tool but different from the ones we have already tested is **Hierarchical Clustering**. In this case, the focus is to give some hierarchy to the observations represented in a dendogram. Close observations will be grouped until we get one group with all the observations. A downside of this tool is that for large data sets is difficult to manage due to time consuming and interpretation of the results. For this reason:

> Code is going to be commented to avoid time-consuming and visualization problems

However, we are going to consider different distances and methods, and that the optimal clusters are k = 2. Notice that phylogenic trees are also not considered for the same reason as the dendograms.    

```{r}
# dis = "euclidean"
# met = "complete"
# d = dist(data, method = dis)
# hc = hclust(d, method = met)
# fviz_dend(hc, k = 2, cex = 0.6, rect = T, repel = T)
```

```{r}
# dis = "manhattan"
# met = "single"
# d = dist(data, method = dis)
# hc = hclust(d, method = met)
# fviz_dend(hc, k = 2, cex = 0.6, rect = T, repel = T)
```

```{r}
# dis = "canberra"
# met = "average"
# d = dist(data, method = dis)
# hc = hclust(d, method = met)
# fviz_dend(hc, k = 2, cex = 0.6, rect = T, repel = T)
```

### PAM:

Before starting with the models we need to determine the number of optimal clusters. We would make some plots using *silhouette* and *WSS* methods to determine it. We see that we could choose either 2 and 3 (*gap_stat* is not considered because it is more time consuming and the results of the previous methods are acceptable).  
```{r}
fviz_nbclust(X_data, kmeans, method = "silhouette", nstart = 1000, linecolor = "#69b3a2")
```

```{r}
fviz_nbclust(X_data, kmeans, method = "wss", nstart = 1000, linecolor = "#69b3a2")
```

#### Two clusters:  

> Private universities vs Public universities  

```{r}
data_pam2 = eclust(X_data, "pam", stand=TRUE, k=2, graph=F)

fviz_cluster(data_pam2, data = X_data, geom = c("point"), pointsize=1, main = "PAM clusplot with 2 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```

In PAM, with **2 clusters** we have the same interpretation than in 6.1.2. *(Mahalanobis with 2 clusters)*:  

```{r}
adjustedRandIndex(km2.mahalanobis$cluster, data_pam2$clustering)
```


#### Three clusters:  

> Above average universities vs Below average public universities vs Below average private universities.    

```{r}
data_pam3 = eclust(X_data, "pam", stand=TRUE, k=3, graph=F)

fviz_cluster(data_pam3, data = X_data, geom = c("point"), pointsize=1, main = "PAM clusplot with 3 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```

With **3 clusters** we also have the same interpretation than in 6.1.1. *(K-Means with 3 clusters)*:  

```{r}
adjustedRandIndex(km3$cluster, data_pam3$clustering)
```

 


### Kernel K-Means:

**Kernel K-Means** is a tool that allow us to capture non-linearly separable clusters in the input dimension.

```{r}
library(kernlab)
```

#### Two clusters:  

We can choose different kernels to see which is the one that best fit with our data: 


With **two clusters** and **gaussian kernel** and taking into account the plot at the beginning of *section 6*, we see that the interpretation could be:  

> More know universities vs Less known universities. 

```{r}
# model:
ker = "rbfdot"
data_ker = kkmeans(as.matrix(X_data), centers=2, kernel=ker)

# plot:
obj.data_ker21 = list(data = X_data, cluster = data_ker@.Data)
fviz_cluster(obj.data_ker21, geom = c("point"), ellipse=F,pointsize=1)+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```
 

> Above average universities vs Below average universities.  

```{r}
# model:
ker = "polydot"
data_ker = kkmeans(as.matrix(X_data), centers=2, kernel=ker)

# plot:
obj.data_ker22 = list(data = X_data, cluster = data_ker@.Data)
fviz_cluster(obj.data_ker22, geom = c("point"), ellipse=F,pointsize=1)+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```

With **two clusters** and **polynomial kernel** we see that it is a similar interpretation than in 6.1.1. *(K-Means with two clusters)*.  

```{r}
adjustedRandIndex(km2$cluster, obj.data_ker22$cluster)
```



#### Three clusters:  

With **three clusters** and **gaussian kernel** and taking into account the plot at the beginning of *section 6*, we see that the interpretation could be:  

> More know universities vs More or less known universities vs Less known universities.  


```{r}
# model:
ker = "rbfdot"
data_ker = kkmeans(as.matrix(X_data), centers=3, kernel=ker)

# plot:
obj.data_ker31 = list(data = X_data, cluster = data_ker@.Data)
fviz_cluster(obj.data_ker31, geom = c("point"), ellipse=F,pointsize=1)+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```


> Above average universities vs Below average public universities vs Below average private universities.    

```{r}
# model:
ker = "laplacedot"
data_ker = kkmeans(as.matrix(X_data), centers=3, kernel=ker)

# plot:
obj.data_ker32 = list(data = X_data, cluster = data_ker@.Data)
fviz_cluster(obj.data_ker32, geom = c("point"), ellipse=F,pointsize=1)+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```

With **three clusters** and **polynomial kernel** we see that the interpretation is a similar to the one in 6.1.1. *(K-Means with three clusters)*. 

```{r}
adjustedRandIndex(km3$cluster, obj.data_ker32$cluster)
```


## Data without Public/Private:  

Once we have computed the models considering the **Public/Private** variable, we could do the same but not considering it:  

### K-Means:  
Because clustering is a tool that uses distances, the recommendable thing to do is to scale the data.  
```{r}
X_out_data = scale(out_data)
```

It is also important to determine the number of optimal clusters. We would make some plots using *silhouette* and *WSS* methods to determine it. We see that we could choose 2 (*gap_stat* is not considered because it is more time consuming and the results of the previous methods are acceptable.  
```{r}
fviz_nbclust(X_out_data, kmeans, method = "silhouette", nstart = 1000, linecolor = "#9E1030FF")
```

```{r}
fviz_nbclust(X_out_data, kmeans, method = "wss", nstart = 1000, linecolor = "#9E1030FF")
```

Before starting with the models, let´s consider the PCA plot in order to see how the observations are going to be placed and to realize the meaning with the loadings of the possible clusters:  

```{r}
library(ggfortify)
pca_plot = autoplot(pca_out, data = out_data,
         label = TRUE, label.size = 3, shape = FALSE,
         loadings = TRUE, loadings.colour = 'red',
         loadings.label = TRUE, loadings.label.size = 5)

library(plotly)
plotly::ggplotly(pca_plot)
```

> Above average universities vs Below average universities.  

```{r}
# K=2:
k = 2
km2_out = kmeans(scale(out_data), center = k, nstart = 1000)
fviz_cluster(km2_out, data = scale(out_data), geom = c("point"),ellipse.type = 'norm', pointsize=1, main = "K-Means clusplot with 2 clusters")+
  theme_minimal()+geom_text(label=row.names(out_data),hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Purples")
```

We can see that we have two differentiated groups. According to the previous interpretation in *4.1.* of the PC, we see that the two clusters are more differentiated by the first component. More to the left indicates that the college is better than the average college and the other way to the right.  

Let´s see how good are the groups:  
As we can see in both plots, groups can be considered as **good** taking into account the silhouette widths. On the other hand, they are not that well-balanced but this seems acceptable.  
```{r}
barplot(table(km2_out$cluster), col="#9E1030FF", main = "Number of colleges per cluster", sub = " Hypothesis: 1 Above Av. / 2 Below Av.")
```

```{r}
d = dist(out_data, method="euclidean")  
out_data_sil = silhouette(km2_out$cluster, d)
plot(out_data_sil, col=1:2, main="", border=NA)
summary(out_data_sil) 
```

### Mahalanobis K-Means:

Now, we could make a change in the input of the K-Means model: distance of the observations. In this case we would make use of the **Mahalanobis** distance. In *R* there is not a specific library or function to apply directly it, so we would need to construct it step by step:  
```{r}
S_x_out = cov(out_data) #  covariance matrix
inv_Sx_out = solve(S_x_out) # S_x^-1 (inverse of S_x)
eigen_Sx_out = eigen(inv_Sx_out)
vector_Sx_out <- eigen_Sx_out$vectors
Y_out = vector_Sx_out %*% diag(sqrt(eigen_Sx_out$values)) %*% t(vector_Sx_out) # inv_Sx_out^1/2
X_til_out = scale(out_data, scale = FALSE)
out_data_Sx = X_til_out %*% Y_out
```

> More popular universities vs Less popular universities  

Let´s consider first **two clusters**:  
```{r}
k = 2
km2_out.mahalanobis = kmeans(out_data_Sx, centers=k, nstart=1000)
```

In the clusplot we see that the interpretation is not straightforward because we have some overlapping on the groups. This model seems that it is not properly working for our intentions. WE can guess that the meaning is more popular and less popular universities.  


```{r}
fviz_cluster(km2_out.mahalanobis, out_data, geom = c("point"),ellipse.type = 'norm', pointsize=1, main = "K-Means with Mahalanobis distance clusplot with 2 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Purples")
```


### Hierarchical Clustering:

Another clustering tool but different from the ones we have already tested is **Hierarchical Clustering**. In this case, the focus is to give some hierarchy to the observations represented in a dendogram. Close observations will be grouped until we get one group with all the observations. A downside of this tool is that for large data sets is difficult to manage due to time consuming and interpretation of the results. For this reason:

> Code is going to be commented to avoid time-consuming and visualization problems

However, we are going to consider different distances and methods, and that the optimal clusters are k = 2. Notice that phylogenic trees are also not considered for the same reason as the dendograms.    

```{r}
# dis = "euclidean"
# met = "complete"
# d = dist(out_data, method = dis)
# hc = hclust(d, method = met)
# fviz_dend(hc, k = 2, cex = 0.6, rect = T, repel = T)
```

```{r}
# dis = "manhattan"
# met = "single"
# d = dist(out_data, method = dis)
# hc = hclust(d, method = met)
# fviz_dend(hc, k = 2, cex = 0.6, rect = T, repel = T)
```

```{r}
# dis = "canberra"
# met = "average"
# d = dist(out_data, method = dis)
# hc = hclust(d, method = met)
# fviz_dend(hc, k = 2, cex = 0.6, rect = T, repel = T)
```

### PAM:

Before starting with the models we need to determine the number of optimal clusters. We would make some plots using *silhouette* and *WSS* methods to determine it. We see that we could choose 2 (*gap_stat* is not considered because it is more time consuming and the results of the previous methods are acceptable.  
```{r}
fviz_nbclust(X_out_data, kmeans, method = "silhouette", nstart = 1000, linecolor = "#9E1030FF")
```

```{r}
fviz_nbclust(X_out_data, kmeans, method = "wss", nstart = 1000, linecolor = "#9E1030FF")
```

> Above average universities vs Below average universities  

```{r}
out_data_pam2 = eclust(X_out_data, "pam", stand=TRUE, k=2, graph=F)

fviz_cluster(out_data_pam2, data = X_out_data, geom = c("point"), pointsize=1, main = "PAM clusplot with 2 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Purples")
```


### Kernel K-Means:

**Kernel K-Means** is a tool that allow us to capture non-linearly separable clusters in the input dimension.

```{r}
library(kernlab)
```


We can choose different kernels to see which is the one that best fit with our data: 


With **two clusters** and **gaussian kernel** and taking into account the plot at the beginning of *section 6*, we see that the interpretation could be:  

> More know universities vs Less known universities. 

```{r}
# model:
ker = "rbfdot"
out_data_ker = kkmeans(as.matrix(X_out_data), centers=2, kernel=ker)

# plot:
obj.out_data_ker21 = list(data = X_out_data, cluster = out_data_ker@.Data)
fviz_cluster(obj.out_data_ker21, geom = c("point"), ellipse=F,pointsize=1)+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Purples")
```
 

> Above average universities vs Below average universities.  

```{r}
# model:
ker = "polydot"
out_data_ker = kkmeans(as.matrix(X_out_data), centers=2, kernel=ker)

# plot:
obj.out_data_ker22 = list(data = X_out_data, cluster = out_data_ker@.Data)
fviz_cluster(obj.out_data_ker22, geom = c("point"), ellipse=F,pointsize=1)+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Purples")
```


## Conclusion:  
Computing the *adjustedRandIndex* would give us a tool to see if models with the two datasets are similar or not. We can only compare models with 2 clusters, and we see that most of the models are around 50%, so this tell us that adding the **Public/Private** variable is determinant in the outcome. However, in the models with *K_Means* the value is 65% and that is due to the interpretation was **Above/Below average**, that has nothing to do with if the college is private or public.   

 
```{r}
adjustedRandIndex(km2$cluster, km2_out$cluster)
```
*K-Means 2 clusters*  
 
```{r}
adjustedRandIndex(km2.mahalanobis$cluster, km2_out.mahalanobis$cluster)
```
*Mahalanobis 2 clusters*  
 
```{r}
adjustedRandIndex(data_pam2$cluster, out_data_pam2$cluster)
```
*PAM 2 clusters*  
 
```{r}
adjustedRandIndex(obj.data_ker21$cluster, obj.out_data_ker22$cluster)
```
*Kernel 2 clusters*  


# Conclusions:  

## Selected models:  

After computing the different models for each dataset (with and without Public/Private) and comparing them, we can select the one that best fit with our intention. In this case, we would choose two models, one for two and one for three clusters. This is because with **two clusters** it is interesting the **Public/Private** groups, and with **three clusters** the difference according to a quality indicator (**above/below average**).  


> 2 clusters: Private universities vs Public universities  

```{r}
k = 2
km2.mahalanobis = kmeans(data_Sx, centers=k, nstart=1000)

fviz_cluster(km2.mahalanobis, data, geom = c("point"),ellipse.type = 'norm', pointsize=1, main = "K-Means with Mahalanobis distance clusplot with 2 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```

> 3 clusters: Above average universities vs Below average public universities vs Below average private universities.  

```{r}
data_pam3 = eclust(X_data, "pam", stand=TRUE, k=3, graph=F)

fviz_cluster(data_pam3, data = X_data, geom = c("point"), pointsize=1, main = "PAM clusplot with 3 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")
```

```{r}
df = data.frame(cluster=data_pam3$cluster, state=college.states) %>% group_by(state)  %>%
  summarise(X = mean(cluster))

plot_usmap(data=df, values = "X") + scale_fill_continuous(
    low = "white", high = "red", name = "Population (2015)")
```

## Insights of models with Profiles:  
After selecting the best models we can use the **profiles** defined in *2.5* to answer some natural questions:  

**Better universities are the ones which TotalCost is higher?**  
These should be a natural question that should be affirmative, and in fact, it is:  
```{r fig.height = 8, fig.width = 9}
p1 = data.frame(z1=pca$x[,1],z2=pca$x[,2]) %>% 
  ggplot(aes(z1,z2,label=college.names,color=data$TotalCost)) + geom_point(size=0) +
  labs(title="Universities map according to TotalCost", x="PC1", y="PC2") +
  theme_bw() + scale_color_gradient(low="lightblue", high="darkblue")+theme(legend.position="bottom") + geom_text(size=2, hjust=0.6, vjust=0, check_overlap = TRUE) 


p2 = fviz_cluster(data_pam3, data = X_data, geom = c("point"), pointsize=1, main = "PAM clusplot with 3 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")

ggarrange(p1, p2, ncol = 1, nrow = 2)
```

**Better universities are Private?** 
Comparing the plot of the model of K-means selected and the graph of the distribution of colleges according to Public/Private, we confirm that our initial guess is true:  
```{r fig.height = 8, fig.width = 9}
p1 = data.frame(z1=pca$x[,1],z2=pca$x[,2]) %>% 
  ggplot(aes(z1,z2,label=college.names,color=college.pub_priv)) + geom_point(size=0) +
  labs(title="Universities map according to Public/Private", x="PC1", y="PC2") +
  theme_bw() + scale_color_gradient(low="lightblue", high="darkblue")+theme(legend.position="bottom") + geom_text(size=2, hjust=0.6, vjust=0, check_overlap = TRUE)

p2 = fviz_cluster(km2.mahalanobis, data, geom = c("point"),ellipse.type = 'norm', pointsize=1, main = "K-Means with Mahalanobis distance clusplot with 2 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")

ggarrange(p1, p2, ncol = 1, nrow = 2)
```



**Better universities are the ones that have low Acceptance rate?**  
We can compare the plot of the clustering model we have selected and a plot with the distribution of colleges according to Acc_Rate. We see that, effectively, acceptance rate or in other words, exclusivity, affects on how good a college is:  
```{r fig.height = 8, fig.width = 9}
p1 = data.frame(z1=pca$x[,1],z2=pca$x[,2]) %>% 
  ggplot(aes(z1,z2,label=college.names,color=data$Acc_Rate)) + geom_point(size=0) +
  labs(title="Universities map according to Acc_Rate", x="PC1", y="PC2") +
  theme_bw() + scale_color_gradient(low="yellow", high="darkblue")+theme(legend.position="bottom") + geom_text(size=2, hjust=0.6, vjust=0, check_overlap = TRUE) 

p2 = fviz_cluster(data_pam3, data = X_data, geom = c("point"), pointsize=1, main = "PAM clusplot with 3 clusters")+
  theme_minimal()+geom_text(label=college.names,hjust=0, vjust=0,size=2,check_overlap = T)+scale_fill_brewer(palette="Greens")

ggarrange(p1, p2, ncol = 1, nrow = 2)
```



**Does the Region affects the position of universities?**  

We cannot affirm that because there is no clear pattern in general. However, what we could say that better and private universities are more likely to be in the **NorthEast** region. This is a natural answer as we take into account that in that region is where the **Ivy League** is (https://www.usnews.com/education/best-colleges/ivy-league-schools).  

```{r fig.height = 8, fig.width = 9}
p1 = data.frame(z1=pca$x[,1],z2=pca$x[,2]) %>% 
  ggplot(aes(z1,z2,label=college.names,color=college.elite)) + geom_point(size=0) +
  labs(title="PCA", x="PC1", y="PC2") +
  theme_bw() + geom_text(size=2, hjust=0.6, vjust=0, check_overlap = TRUE)

p2 = data.frame(z1=pca$x[,1],z2=pca$x[,2]) %>% 
  ggplot(aes(z1,z2,label=college.states,color=college.regions)) + geom_point(size=0) +
  labs(title="Universities map according to TotalCost", x="PC1", y="PC2") +
  theme_bw() + theme(legend.position="bottom") + geom_text(size=2, hjust=0.6, vjust=0, check_overlap = TRUE)

ggarrange(p1, p2, ncol = 1, nrow = 2)
```

We can also confirm it by looking at the us map for **TotalCost** and **Acc_Rate**. We see that universities in the **NorthEast** region (*IvyLeague*) and in the West (*Caltech*, *Stanford*,...) have a higher cost:  
```{r fig.height = 8, fig.width = 9}
df = data.frame(cost=data$TotalCost, state=college.states) %>% group_by(state)  %>%
  summarise(X = median(cost))

p1 = plot_usmap(data=df, values = "X") + scale_fill_continuous(
    low = "white", high = "#CB454A", name = "Total Cost") + labs(title = "Distribution of universities in the US by Total Cost") 
```

```{r fig.height = 8, fig.width = 9}
df = data.frame(acc=data$Acc_Rate, state=college.states) %>% group_by(state)  %>%
  summarise(X = mean(acc))

p2 = plot_usmap(data=df, values = "X") + scale_fill_continuous(
    low = "#CB454A", high = "white", name = "Acc Rate") + labs(title = "Distribution of universities in the US by Acceptance Rate") 
```

```{r fig.height = 8, fig.width = 9}
ggarrange(p1, p2, ncol = 2, nrow = 1)
```

We have more or less clear that better universities are placed mainly in **NorthEast** and **West** regions, but let´s confirm it with the previous profile **Elite** universities:  

```{r}
df = data.frame(acc=college.elite, state=college.states) %>% group_by(state)  %>%
  summarise(X = sum(acc))

plot_usmap(data=df, values = "X") + scale_fill_continuous(
    low = "white", high = "#CB454A", name = "Acc Rate")  + labs(title = "Distribution of Elite universities in the US") 
```

We can conclude that, effectively, better universities are in that regions.  

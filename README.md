# usuniversities

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


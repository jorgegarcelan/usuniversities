# 🎓 US Universities Analysis

This project focuses on analyzing data from over 1000 universities in the United States using **unsupervised learning techniques** such as Principal Component Analysis (PCA), Factor Analysis (FA), and clustering. The goal is to categorize universities by key characteristics, such as whether they are public or private, and measure their quality based on several academic and financial variables. Through this analysis, we aim to gain a broader understanding of the U.S. post-secondary education system, providing insights into the factors that differentiate universities.

## ✨ Objectives

- Use **PCA** to reduce the dimensionality of the data while retaining the most important variables.
- Apply **Factor Analysis (FA)** to identify latent factors that contribute to the differences between universities.
- Perform **Clustering** to group universities based on their characteristics, providing a clearer segmentation of the education landscape.
- Investigate relationships between the type of institution (public/private) and their performance metrics.

## 📊 Dataset Information

The dataset used in this project comes from the **Integrated Postsecondary Education Data System (IPEDS)** and contains detailed information on U.S. universities. It was also used in the **1995 Data Analysis Exposition** for the ASA Statistical Graphics Section.

- **Source**: [IPEDS Data Center](https://nces.ed.gov/ipeds/datacenter/InstitutionByGroup.aspx)
- **Sample Size**: 1000+ U.S. universities
- **Variables**: The dataset includes variables related to admissions, SAT/ACT scores, tuition, faculty qualifications, and more. Key variables are listed below:

| Variable         | Description                                |
| ---------------- | ------------------------------------------ |
| FICE             | Federal ID number                          |
| X                | College name                               |
| State            | Postal code of the state                   |
| Public/private   | Indicator of public (1) or private (2)      |
| Av_Math_SAT      | Average Math SAT score                     |
| Av_Verbal_SAT    | Average Verbal SAT score                   |
| Av_Comb_SAT      | Average Combined SAT score                 |
| Av_ACT_score     | Average ACT score                          |
| Top10perc        | % new students from top 10% of H.S. class  |
| Top25perc        | % new students from top 25% of H.S. class  |
| In-state         | In-state tuition cost                      |
| Out-of-state     | Out-of-state tuition cost                  |
| Room_board       | Room and board costs                       |
| Instructional    | Instructional expenditure per student      |
| Grad_Rate        | Graduation rate                            |
| ...and more.     |

For a complete list of variables, please refer to the dataset.

## 🛠️ Methods

1. **Principal Component Analysis (PCA)**:  
   PCA was used to reduce the number of variables while maintaining the variance in the dataset. This helped in identifying the most important factors influencing university performance.

2. **Factor Analysis (FA)**:  
   FA was applied to uncover latent variables that may not be directly measurable but still affect university rankings and classifications.

3. **Clustering**:  
   K-means and hierarchical clustering methods were employed to group universities into distinct categories based on their characteristics, such as tuition costs, student/faculty ratios, and graduation rates.

## 🚀 Results and Insights

- **Segmentation of Universities**: We were able to separate universities into clear clusters, revealing insights into what differentiates top-tier institutions from others.
- **Key Factors**: Through FA and PCA, it was found that variables such as graduation rate, instructional spending, and SAT/ACT scores are major differentiators between public and private institutions.
- **Impact of Student/Faculty Ratio**: Universities with a lower student/faculty ratio tend to have higher graduation rates and a greater percentage of alumni donations.

## 📄 Attribution

This project was created and maintained by **Jorge Garcelán**.  
If you use or reference this work, please attribute it to the original creator.

## 📬 Contact

For further inquiries or dataset requests, feel free to reach out via email:  
📧 [jorgegarcelan@gmail.com](mailto:jorgegarcelan@gmail.com)


import streamlit as st
import re
import pandas as pd
from sklearn import preprocessing
from sklearn.tree import DecisionTreeClassifier, _tree
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.svm import SVC
import csv
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Load data
training = pd.read_csv('Data/Training.csv')

# Preprocess data
cols = training.columns[:-1]
x = training[cols]
y = training['prognosis']
le = preprocessing.LabelEncoder()
le.fit(y)
y = le.transform(y)

# Split data
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.33, random_state=42)

# Train model
clf = DecisionTreeClassifier()
clf.fit(x_train, y_train)

# Helper functions
def getDescription():
    description_list = {}
    with open('MasterData/symptom_Description.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            description_list[row[0]] = row[1]
    return description_list

def getSeverityDict():
    severityDictionary = {}
    with open('MasterData/symptom_severity.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            severityDictionary[row[0]] = int(row[1])
    return severityDictionary

def getprecautionDict():
    precautionDictionary = {}
    with open('MasterData/symptom_precaution.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            precautionDictionary[row[0]] = [row[1], row[2], row[3], row[4]]
    return precautionDictionary

def getfood_avoid():
    food_avoid = {}
    with open('MasterData/Disease_avoid_food.csv', mode='r', newline='') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            try:
                food_avoid[row[0]] = [row[1], row[2], row[3], row[4]]
            except:
                try:
                    food_avoid[row[0]] = [row[1], row[2], row[3]]
                except:
                    food_avoid[row[0]] = [row[1], row[2]]
    return food_avoid

description_list = getDescription()
severityDictionary = getSeverityDict()
precautionDictionary = getprecautionDict()
food_avoid = getfood_avoid()

def check_pattern(dis_list, inp):
    pred_list=[]
    inp = inp.replace(' ', '_')
    patt = f"{inp}"
    regexp = re.compile(patt)
    pred_list = [item for item in dis_list if regexp.search(item)]
    if len(pred_list) > 0:
        return 1, pred_list
    else:
        return 0, []

def sec_predict(symptoms_exp):
    rf_clf = DecisionTreeClassifier()
    rf_clf.fit(x_train, y_train)

    symptoms_dict = {symptom: index for index, symptom in enumerate(x)}
    input_vector = np.zeros(len(symptoms_dict))
    for item in symptoms_exp:
        input_vector[[symptoms_dict[item]]] = 1

    return rf_clf.predict([input_vector])

def calc_condition(exp, days):
    sum = 0
    for item in exp:
        sum = sum + severityDictionary.get(item, 0)  # severity based on the days and symptoms
    if (sum * days) / (len(exp) + 1) > 13:  # severe
        st.write("You should take the consultation from doctor. ")
    else:  # Not severe
        st.write("It might not be that bad but you should take precautions.")

def print_disease(node):
    node = node[0]
    val = node.nonzero()
    disease = le.inverse_transform(val[0])
    return list(map(lambda x: x.strip(), list(disease)))

def tree_to_code(tree, feature_names):
    tree_ = tree.tree_
    feature_name = [
        feature_names[i] if i != _tree.TREE_UNDEFINED else "undefined!"
        for i in tree_.feature
    ]

    chk_dis = ",".join(feature_names).split(",")
    symptoms_present = []
    disease_input = st.text_input("Enter the symptom you are experiencing:")
    conf, cnf_dis = check_pattern(chk_dis, disease_input)
    if conf == 1:
        if len(cnf_dis) > 1:
            conf_inp = st.selectbox(f"Select the one you meant (options: {cnf_dis})", cnf_dis)
            disease_input = conf_inp
        else:
            disease_input = cnf_dis[0]

    num_days = st.number_input(f"From how many days are you having {disease_input}:", min_value=0)

    def recurse(node, depth):
        if tree_.feature[node] != _tree.TREE_UNDEFINED:
            name = feature_name[node]
            threshold = tree_.threshold[node]

            if name == disease_input:
                val = 1
            else:
                val = 0
            if val <= threshold:
                recurse(tree_.children_left[node], depth        + 1)
            else:
                symptoms_present.append(name)
                recurse(tree_.children_right[node], depth + 1)
        else:
            present_disease = print_disease(tree_.value[node])
            red_cols = reduced_data.columns 
            symptoms_given = red_cols[reduced_data.loc[present_disease].values[0].nonzero()]
            st.write("Are you experiencing any ")
            symptoms_exp=[]
            for syms in list(symptoms_given):
                inp=""
                st.write(f"{syms}?")
                inp = st.radio(f"{syms.capitalize()}?", options=["Yes", "No"]).lower()
                if inp == "yes":
                    symptoms_exp.append(syms)

            second_prediction = sec_predict(symptoms_exp)
            calc_condition(symptoms_exp, num_days)
            if present_disease[0] == second_prediction[0]:
                st.write(f"You may have {present_disease[0]}")
                st.write(description_list[present_disease[0]])
            else:
                st.write(f"You may have {present_disease[0]} or {second_prediction[0]}")
                st.write(description_list[present_disease[0]])
                st.write(description_list[second_prediction[0]])

            precaution_list = precautionDictionary[present_disease[0]]
            st.write("Take following measures:")
            for i, j in enumerate(precaution_list):
                st.write(f"{i+1}) {j.capitalize()}")

            st.write(f"Avoid these food items for {present_disease[0]}:")
            for i, j in enumerate(food_avoid[present_disease[0]]):
                st.write(f"{i+1}) {j.capitalize()}")

    recurse(0, 1)

if __name__ == "__main__":
    st.title("Disease Predictor")
    tree_to_code(clf, cols)


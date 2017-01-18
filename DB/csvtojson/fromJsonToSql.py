# -*- coding: WINDOWS-1255 -*-
import codecs
import json

import io
import re

with open('fromCSVFile.json') as json_data:
    d = json.load(json_data)
    print(d)

    ''' the ans param is for print debug'''
    ans = ""

    hebrew_key_val = {}
    hebrew_lines = []
    for dict in d:
        ans += "{"
        for key, val in dict.items():
            if key != '-':
                hebrew_key_val.update({key:val})
                ans += key + ":" + val + ","
        ans += "}"
        hebrew_lines.append(hebrew_key_val)
        hebrew_key_val = {}
    f = open('shaked.txt', 'w')
    encodingHeb = 'utf-16le' # sorry, Windows users... :(
    with io.open('shaked.txt', 'w', encoding=encodingHeb) as f:
        f.write(ans)
    print hebrew_lines


    #------------------------------------------------------------#

    d = '��� ����'
    difficulty = d.decode('windows-1255')
    p = '����'
    profession = p.decode('windows-1255')
    q = '�����'
    question = q.decode('windows-1255')
    mt = '��� ����'
    media_type = mt.decode('windows-1255')
    mc = '���� �����'
    media_content = mc.decode('windows-1255')
    mpf = '����'
    media_pos_feedback = mpf.decode('windows-1255')
    mnf = '���� �����'
    media_neg_feedback = mnf.decode('windows-1255')
    s = '�������'
    skill = s.decode('windows-1255')

    print hebrew_lines


    string_to_sql_file = ""
    for line in hebrew_lines:
        pattern = 'INSERT INTO `textra_db`.`questions` ' \
                  '(`Q_qeustion`, `isMultipuleAns`, `Q_mediaType`, `Q_media`, ' \
                  '`Q_correctFB`, `Q_notCorrectFB`, `Q_skill`, `Q_difficulty`, ' \
                  '`Q_proffession`, `Q_approved`, `Q_disabled`) VALUES (\''
        question_content = re.sub('\'','\\\'',line[question])
        pattern += question_content
        media_type_content = re.sub('\'','\\\'',line[media_type])
        pattern += '\', \'0\',\'' + media_type_content
        media_content_content = re.sub('\'','\\\'',line[media_content])
        pattern += '\',\'' + media_content_content
        pattern += '\',\'' + line[media_pos_feedback]
        pattern += '\',\'' + line[media_neg_feedback]
        pattern += '\',\'' + line[skill]
        pattern += '\',\'' + line[difficulty]
        pattern += '\',\'' + profession + '\',\'1\',\'0\'' + ');\n'
        string_to_sql_file += pattern

    #----------------------------------------------------------#


    file = codecs.open("Qinstances.sql", "w", "utf-8")
    file.write(string_to_sql_file)
    file.close()

    #----------------------------------------------------------#


    correct_ans = '����� �����'
    correct_ans_enc = correct_ans.decode('windows-1255')
    distractor_a = '���� �'
    distractor_a_enc = distractor_a.decode('windows-1255')
    distractor_b = '���� �'
    distractor_b_enc = distractor_b.decode('windows-1255')
    distractor_c = '���� �'
    distractor_c_enc = distractor_c.decode('windows-1255')

    string_to_sql_file = ""
    pattern =""
    i = 1
    for line in hebrew_lines:
        pattern = 'INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES (\''
        answer_content = re.sub('\'','\\\'',line[correct_ans_enc])
        pattern += answer_content + '\',\'' + str(i) + '\',\'1\');\n'

        pattern += 'INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES (\''
        answer_content = re.sub('\'','\\\'',line[distractor_a_enc])
        pattern += answer_content + '\',\'' + str(i) + '\',\'0\');\n'

        pattern += 'INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES (\''
        answer_content = re.sub('\'','\\\'',line[distractor_b_enc])
        pattern += answer_content + '\',\'' + str(i)  + '\',\'0\');\n'

        pattern += 'INSERT INTO `textra_db`.`answers` (`answer`, `Q_id`, `isCorrect`) VALUES (\''
        answer_content = re.sub('\'','\\\'',line[distractor_c_enc])
        pattern += answer_content + '\',\'' + str(i) + '\',\'0\')\n;'

        i += 1
        string_to_sql_file += pattern

    file = codecs.open("Ainstances.sql", "w", "utf-8")
    file.write(string_to_sql_file)
    file.close()
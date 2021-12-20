var ruleManagement = {};

ruleManagement.init = function() {

  api.convertButton('addFormButton', ruleManagement.addRule,
      'ruleManagementField');

  api.boardUri = document.getElementById('boardIdentifier').value;

  var rules = document.getElementsByClassName('ruleManagementCell');

  for (var i = 0; i < rules.length; i++) {
    ruleManagement.processRuleCell(rules[i]);
  }

  ruleManagement.ruleDiv = document.getElementById('divRules');

};

ruleManagement.processRuleCell = function(cell) {

  var button = cell.getElementsByClassName('deleteFormButton')[0];

  api.convertButton(button, function() {

    var index = cell.getElementsByClassName('indexIdentifier')[0].value;

    api.formApiRequest('ruleAction', {
      boardUri : api.boardUri,
      ruleIndex : index,
    }, function requestComplete(status, data) {
      if (status === 'ok') {
        cell.remove();

        var identifiers = document.getElementsByClassName('indexIdentifier');

        for (var i = 0; i < identifiers.length; i++) {
          identifiers[i].value = i.toString();
        }

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  });

  button = cell.getElementsByClassName('editFormButton')[0];

  api.convertButton(button, function() {

    var index = cell.getElementsByClassName('indexIdentifier')[0].value;

    api.formApiRequest('ruleAction', {
      boardUri : api.boardUri,
      action : 'edit',
      rule : cell.getElementsByClassName('textField')[0].value,
      ruleIndex : index,
    }, function requestComplete(status, data) {
      if (status === 'ok') {
        alert('利用規約を編集しました。');
      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  });

};

ruleManagement.showNewRule = function(typedRule) {

  var form = document.createElement('form');
  form.className = 'ruleManagementCell';
  form.action = '/deleteRule.js';
  form.method = 'post';
  form.enctype = 'multipart/form-data';
  ruleManagement.ruleDiv.appendChild(form);

  var rulePara = document.createElement('p');
  form.appendChild(rulePara);

  var ruleField = document.createElement('input');
  ruleField.className = 'textField';
  ruleField.type = 'text';
  ruleField.value = typedRule;
  rulePara.appendChild(ruleField);

  var indexIdentifier = document.createElement('input');
  indexIdentifier.className = 'indexIdentifier';
  indexIdentifier.type = 'hidden';
  indexIdentifier.name = 'ruleIndex';
  indexIdentifier.value = document.getElementsByClassName('indexIdentifier').length;
  form.appendChild(indexIdentifier);

  var boardIdentifier = document.createElement('input');
  boardIdentifier.type = 'hidden';
  boardIdentifier.name = 'boardUri';
  boardIdentifier.className = 'boardIdentifier';
  boardIdentifier.value = api.boardUri;
  form.appendChild(boardIdentifier);

  var editButton = document.createElement('button');
  editButton.type = 'submit';
  editButton.name = 'action';
  editButton.value = 'edit';
  editButton.innerHTML = '編集';
  editButton.className = 'deleteFormButton';
  form.appendChild(editButton);

  var deleteButton = document.createElement('button');
  deleteButton.type = 'submit';
  deleteButton.innerHTML = '消去';
  deleteButton.className = 'deleteFormButton';
  form.appendChild(deleteButton);

  form.appendChild(document.createElement('hr'));

  ruleManagement.processRuleCell(form);

};

ruleManagement.addRule = function() {

  var typedRule = document.getElementById('fieldRule').value.trim();

  if (!typedRule.length) {
    alert('空白のルールを通知することはできません');

  } else if (typedRule.length > 512) {
    alert('長すぎるルールは、512文字以内に収めてください。');
  } else {

    api.formApiRequest('createRule', {
      boardUri : api.boardUri,
      rule : typedRule,
    }, function requestComplete(status, data) {
      if (status === 'ok') {

        document.getElementById('fieldRule').value = '';
        ruleManagement.showNewRule(typedRule);

      } else {
        alert(status + ': ' + JSON.stringify(data));
      }
    });

  }

};

ruleManagement.init();
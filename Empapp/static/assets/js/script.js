// form group steps
document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('#editModal .form-step',);
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        document.getElementById('prevBtn').style.display = stepIndex === 0 ? 'none' : 'inline';
        document.getElementById('nextBtn').style.display = stepIndex === steps.length - 1 ? 'none' : 'inline';
        document.getElementById('submitBtn').style.display = stepIndex === steps.length - 1 ? 'inline' : 'none';
    }

    document.getElementById('nextBtn').addEventListener('click', function() {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });

    document.getElementById('prevBtn').addEventListener('click', function() {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    showStep(currentStep);
});

function openDeleteEmpModal(empId) {
    const csrftoken = getCookie('csrftoken');
    $.ajax({
        headers: { "X-CSRFToken": csrftoken },
        url: '/delete/' + empId + '/',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                var emp = response.emp;
  
                $('#deleteEmpName').val(emp.empname_eng);
                $('#deleteEmpIdn').val(emp.empidn);
                $('#deleteEmpNumber').val(emp.empnumber);
                $('#deleteOtherNumber').val(emp.othernumber);
                $('#deleteEmpEmail').val(emp.empemail);
                $('#deleteBirthDate').val(emp.birth_date);
                $('#deleteCity').val(emp.city);
                $('#deleteGender').val(emp.gender);
                $('#deleteMaritalStatus').val(emp.marital_status);
                $('#deleteJopt').val(emp.jopt);
                $('#deleteSuprid').val(emp.suprid);
                $('#deleteStatsid').val(emp.statsid);
                $('#deleteDeptid').val(emp.deptid);
                $('#deleteJoindate').val(emp.joindate);
                $('#deleteFormSent').prop('checked', emp.form_sent);
                
                $('#deleteModalLabel').text('Confirm Delete of ' + emp.empname_eng);        
                $('#deleteForm').attr('action', '/delete/' + empId + '/');
                $('#deleteModal').modal('show');
            } else {
                alert('Failed to fetch employee data.');
            }
        },
        error: function() {
            alert('An error occurred while fetching the employee data.');
        }
    });
  }
  
  function confirmDelete() {

    const csrftoken = getCookie('csrftoken');
    $.ajax({
        url: $('#deleteForm').attr('action'),
        type: 'POST',
        data: {
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
        },
        
        success: function(response) {
            if (response.success) {
               
                $('#editModal').modal('hide'); 
                $('#success_tic').modal('show'); 
                setTimeout(function() {
                    $('#successModal').modal('hide'); 
                    location.reload(); 
                }, 2000); 
            } else {
                alert('Failed to delete the employee.');
            }
        },
        error: function() {
            alert('An error occurred while deleting the employee.');
        }
    });
  }
  

  function openEditEmpModal(empId) {
    $.ajax({
        url: '/edit/' + empId + '/',
        type: 'GET',
        success: function(response) {
            if (response.success) {
                var emp = response.emp;
                var supervisors = response.supervisors;
                var statuses = response.statuses;
                var departments = response.departments;
                var genders = response.genders;
                var cities = response.cities;
                var marital_statuses = response.marital_statuses;
                
                $('#editEmpName').val(emp.empname_eng);
                $('#editEmpIdn').val(emp.empidn);
                $('#editEmpNumber').val(emp.empnumber);
                $('#editOtherNumber').val(emp.othernumber);
                $('#editEmpEmail').val(emp.empemail);
                $('#editBirthDate').val(emp.birth_date);
                $('#editCity').val(emp.city);
                $('#editGender').val(emp.gender);
                $('#editMaritalStatus').val(emp.marital_status);
                $('#editJopt').val(emp.jopt);
                $('#editSuprid').val(emp.suprid);
                $('#editStatsid').val(emp.statsid);
                $('#editDeptid').val(emp.deptid);
                $('#editJoindate').val(emp.joindate);
                $('#editFormSent').prop('checked', emp.form_sent);
                
                $('#editModalLabel').text('Edit Employee: ' + emp.empname_eng);        
                $('#editForm').attr('action', '/edit/' + empId + '/');

                populateDropdown('#editSuprid', supervisors,'suprid', 'supname');
                populateDropdown('#editStatsid', statuses, 'statsid', 'stutsname');
                populateDropdown('#editDeptid', departments, 'deptid', 'deptname');
                populateDropdown('#editGender', genders, 'id', 'name');
                populateDropdown('#editCity', cities, 'id', 'name');
                populateDropdown('#editMaritalStatus', marital_statuses, 'id', 'name');
                        
                $('#editModal').modal('show');
            } else {
                alert('Failed to fetch employee data.');
            }
        },
        error: function() {
            alert('An error occurred while fetching the employee data.');
        }
    });
}

function populateDropdown(selector, options, valueKey, textKey) {
    var $dropdown = $(selector);
    $dropdown.empty();
    $dropdown.append('<option value="">Select an option</option>'); 
    $.each(options, function(index, item) {
        $dropdown.append($('<option></option>').val(item[valueKey]).text(item[textKey]));
    });
}

function confirmEdit() {
    var csrftoken = getCookie('csrftoken');
    var formData = $('#editForm').serialize();
    console.log("Form data:", formData);  

    $.ajax({
        url: $('#editForm').attr('action'),
        type: 'POST',
        data: formData,
        headers: {
            'X-CSRFToken': csrftoken
        },
        success: function(response) {
            if (response.success) {
                $('#editModal').modal('hide'); 
                $('#success_tic').modal('show'); 
                setTimeout(function() {
                    $('#successModal').modal('hide'); 
                    location.reload(); 
                }, 2000); 
            } else {
                alert('Failed to edit the employee.');
            }
        },
        error: function() {
            alert('An error occurred while editing the employee.');
        }
    });
}


function Oncancel() {
    $('#editModal').modal('hide');
    $('#deleteModal').modal('hide');
}

// Get CSRF token function
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function openInfoEmpModal(empId) {
    $.ajax({
        url: '/edit/' + empId + '/',  
        type: 'GET',
        success: function(response) {
            if (response.success) {
                var emp = response.emp;
                
                $('#infoEmpName').val(emp.empname_eng);
                $('#infoEmpIdn').val(emp.empidn);
                $('#infoEmpNumber').val(emp.empnumber);
                $('#infoOtherNumber').val(emp.othernumber);
                $('#infoEmpEmail').val(emp.empemail);
                $('#infoBirthDate').val(emp.birth_date);
                $('#infoCity').val(emp.city);
                $('#infoGender').val(emp.gender);
                $('#infoMaritalStatus').val(emp.marital_status);
                $('#infoJopt').val(emp.jopt);
                $('#infoSuprid').val(emp.suprid);
                $('#infoStatsid').val(emp.statsid);
                $('#infoDeptid').val(emp.deptid);
                $('#infoJoindate').val(emp.joindate);
                $('#infoFormSent').prop('checked', emp.form_sent).prop('disabled', true);
                
                $('#infoModal').modal('show');
            } else {
                alert('Failed to fetch employee data.');
            }
        },
        error: function() {
            alert('An error occurred while fetching the employee data.');
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const infoModal = document.getElementById('infoModal');
    if (infoModal) {
        let currentStep = 0;
        const steps = infoModal.querySelectorAll('.form-stepinfo');
        const nextButton = infoModal.querySelector('#nextBtn');
        const prevButton = infoModal.querySelector('#prevBtn');

        function showStep(step) {
            steps.forEach((s, index) => {
                s.classList.toggle('active', index === step);
            });

            prevButton.disabled = step === 0;
            nextButton.disabled = step === steps.length - 1;
        }

        if (nextButton && prevButton) {
            nextButton.addEventListener('click', function () {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            });

            prevButton.addEventListener('click', function () {
                if (currentStep > 0) {
                    currentStep--;
                    showStep(currentStep);
                }
            });
        }

        // Initialize
        showStep(currentStep);
    }
});


document.addEventListener('DOMContentLoaded', function () {

    var successMessageShown = sessionStorage.getItem('successMessageShown');
    
    if (successMessageShown === 'true') {
        var successModal = new bootstrap.Modal(document.getElementById('success_tic'));
        setTimeout(function() {
            successModal.hide();
        }, 2000);
        
        // clean
        sessionStorage.removeItem('successMessageShown');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-groupdei').forEach(function(group) {
        var moreBtn = group.querySelector('#moreBtn');
        var extraButtons = group.querySelector('#extraButtons');

        group.addEventListener('mouseover', function() {
            extraButtons.style.display = "block";
            moreBtn.style.display = "none";
        });

        group.addEventListener('mouseout', function() {
            
            setTimeout(function() {
                if (!group.matches(':hover')) {
                    extraButtons.style.display = "none";
                    moreBtn.style.display = "inline-block";
                }
            }, 100);
        });

        extraButtons.addEventListener('mouseover', function() {
            this.style.display = "block";
            moreBtn.style.display = "none";
        });

        extraButtons.addEventListener('mouseout', function() {
           
            setTimeout(function() {
                if (!extraButtons.matches(':hover') && !moreBtn.matches(':hover')) {
                    extraButtons.style.display = "none";
                    moreBtn.style.display = "inline-block";
                }
            }, 100);
        });
    });
});



document.addEventListener("DOMContentLoaded", function() {
    var tdElements = document.querySelectorAll('td[id^="deptid-"]');
    
    tdElements.forEach(function(td) {
        var text = td.textContent.trim();
        var words = text.split(" ");
        if (words.length > 1) {
            words[1] = 'Dept';  
        }
        td.textContent = words.join(" ");
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('dynamic-text');
    if (textElement) { 
        const originalText = "Emp System";
        const newText = "Welcome to";

        function changeText() {
            textElement.classList.add('fade-out', 'zoom-out');

            setTimeout(() => {
                textElement.textContent = newText;
                textElement.classList.remove('fade-out', 'zoom-out');
                textElement.classList.add('fade-in', 'zoom-in');

                setTimeout(() => {
                    textElement.classList.add('fade-out', 'zoom-out');

                    setTimeout(() => {
                        textElement.textContent = originalText;
                        textElement.classList.remove('fade-out', 'zoom-out');
                        textElement.classList.add('fade-in', 'zoom-in');
                        setTimeout(changeText, 1500); 
                    }, 1500); 
                }, 2000); 
            }, 2000); 
        }

        changeText();
    } else {
        console.error('Element with id "dynamic-text" not found');
    }
});


(function() {
    'use strict';
    window.addEventListener('load', function() {
     
      var forms = document.getElementsByClassName('needs-validation');
      
      Array.prototype.filter.call(forms, function(form) {
        form.addEventListener('submit', function(event) {
          
          if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
          }
          
          form.classList.add('was-validated');
        }, false);
      });
    }, false);
  })();
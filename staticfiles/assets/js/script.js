// form group steps
document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.form-step');
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

// Delete fun
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
                location.reload(); 
            } else {
                alert('Failed to delete the employee.');
            }
        },
        error: function() {
            alert('An error occurred while deleting the employee.');
        }
    });
  }
  
  // edifun
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

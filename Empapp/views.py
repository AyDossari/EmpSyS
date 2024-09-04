from email.message import EmailMessage
from django.contrib import messages
from django.db import IntegrityError
from django.template import loader
from django.template.loader import render_to_string
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, render , redirect
from django.views.decorators.csrf import csrf_exempt
from Empapp.forms import EmpForm , CustomLoginForm
from Empapp.models import Emp, Super, Statemp , Dept
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import login, authenticate
from django.contrib.auth import views as auth_views
from django.urls import path
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout

# Creeate your views here.

def landing_page(request):
    template=loader.get_template('landing_page.html')
    return HttpResponse(template.render())

@login_required
def custom_logout(request):
    logout(request)
    return redirect('landing_page') 
    
@login_required
def index(request):
    template=loader.get_template('base.html')
    return HttpResponse(template.render())
@login_required
def emp_form(request):
    form = EmpForm()
    return render(request, 'EmpPage/EmpForm.html', {'form': form})
@login_required
def employee_list(request):
    query = request.GET.get('q', '')    
    if query:
        employees = Emp.objects.filter(empname_eng__icontains=query)
    else:
        employees = Emp.objects.all()
    
    template = loader.get_template('EmpPage/Emp_list.html')
    context = {
        'employees': employees,
    }
    
    return HttpResponse(template.render(context, request))


@login_required
def create_emp(request):
    if request.method == 'POST':
        form = EmpForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, 'Operation successful!')
            request.session['successMessageShown'] = 'true'

            if form.cleaned_data.get('form_sent'):
                subject = 'Employee Form Submitted'
                message = render_to_string('EmpPage/email_template.html', {
                    'form_data': form.cleaned_data
                })
                
                # Define the sender's email address
                from_email = settings.DEFAULT_FROM_EMAIL

                # Define the recipient list; in this case, it's a single email address
                recipient_list = ['bo.naif502@gmail.com']

                # Send an email with the specified parameters
                send_mail(
                    subject,             # Subject of the email
                    message,             # Plain text message body of the email
                    from_email,          # Sender's email address (pulled from settings)
                    recipient_list,      # List of recipients
                    html_message=message # HTML content of the email (same as the plain text message in this case)
                )
            return redirect('employee_list')
    else:
        form = EmpForm()
        print('is not')

    return render(request, 'EmpPage/EmpForm.html', {'form': form})
@login_required
def delete_emp(request, pk):
    if request.method == 'GET':
        emp = get_object_or_404(Emp, pk=pk)
        emp_data = {
        'empid': emp.empid,
        'empidn': emp.empidn,
        'empname_eng': emp.empname_eng,
        'empnumber': emp.empnumber,
        'othernumber': emp.othernumber,
        'empemail': emp.empemail,
        'birth_date': emp.birth_date,
        'city': emp.city,
        'gender': emp.gender,
        'marital_status': emp.marital_status,
        'jopt': emp.jopt,
        'suprid': emp.suprid.supname if emp.suprid else None,
        'statsid': emp.statsid.stutsname if emp.statsid else None,
        'deptid': emp.deptid.deptname if emp.deptid else None,
        'joindate': emp.joindate,
        'form_sent': emp.form_sent
         }
    
        return JsonResponse({
            'success': True,
            'emp': emp_data
        })
    
    if request.method == 'POST':
        emp = get_object_or_404(Emp, pk=pk)
        
       
        emp_data = {
        'empid': emp.empid,
        'empidn': emp.empidn,
        'empname_eng': emp.empname_eng,
        'empnumber': emp.empnumber,
        'othernumber': emp.othernumber,
        'empemail': emp.empemail,
        'birth_date': emp.birth_date,
        'city': emp.city,
        'gender': emp.gender,
        'marital_status': emp.marital_status,
        'jopt': emp.jopt,
        'suprid': emp.suprid.supname if emp.suprid else None,
        'statsid': emp.statsid.stutsname if emp.statsid else None,
        'deptid': emp.deptid.pk if emp.deptid else None,
        'joindate': emp.joindate,
        'form_sent': emp.form_sent
         }
        
        emp.delete()
        
        return JsonResponse({
            'success': True,
            'message': 'Form deleted successfully',
            'emp': emp_data
        })
    
    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)


@login_required
def edit_emp(request, pk):
    emp = get_object_or_404(Emp, pk=pk)

    if request.method == 'GET':
        emp_data = {
            'empid': emp.empid,
            'empidn': emp.empidn,
            'empname_eng': emp.empname_eng,
            'empnumber': emp.empnumber,
            'othernumber': emp.othernumber,
            'empemail': emp.empemail,
            'birth_date': emp.birth_date,
            'city': emp.city,
            'gender': emp.gender,
            'marital_status': emp.marital_status,
            'jopt': emp.jopt,
            'suprid': emp.suprid.supname if emp.suprid else None,
            'statsid': emp.statsid.stutsname if emp.statsid else None,
            'deptid': emp.deptid.deptname if emp.deptid else None,
            'joindate': emp.joindate,
            'form_sent': emp.form_sent
        }

        supervisors = Super.objects.all().values('suprid', 'supname')
        statuses = Statemp.objects.all().values('statsid', 'stutsname')
        departments = Dept.objects.all().values('deptid', 'deptname')
        


        return JsonResponse({
            'success': True,
            'emp': emp_data,
            'supervisors': list(supervisors),
            'statuses': list(statuses),
            'departments': list(departments),
            'genders': [{'id': k, 'name': v} for k, v in Emp.GENDER_CHOICES],
            'cities': [{'id': k, 'name': v} for k, v in Emp.CITIES_CHOICES],
            'marital_statuses': [{'id': k, 'name': v} for k, v in Emp.MARITAL_STATUS_CHOICES],
        })
        
    elif request.method == 'POST':
        emp_data = {
            'empidn': request.POST.get('empidn'),
            'empname_eng': request.POST.get('empname_eng'),
            'empnumber': request.POST.get('empnumber'),
            'othernumber': request.POST.get('othernumber'),
            'empemail': request.POST.get('empemail'),
            'birth_date': request.POST.get('birth_date'),
            'city': request.POST.get('city'),
            'gender': request.POST.get('gender'),
            'marital_status': request.POST.get('marital_status'),
            'jopt': request.POST.get('jopt'),
            'suprid': request.POST.get('suprid'),
            'statsid': request.POST.get('statsid'),
            'deptid': request.POST.get('deptid'),
            'joindate': request.POST.get('joindate'),
            'form_sent': request.POST.get('form_sent') == 'on'
        }



        emp.empidn = emp_data['empidn']
        emp.empname_eng = emp_data['empname_eng']
        emp.empnumber = emp_data['empnumber']
        emp.othernumber = emp_data['othernumber']
        emp.empemail = emp_data['empemail']
        emp.birth_date = emp_data['birth_date']
        emp.city = emp_data['city']
        emp.gender = emp_data['gender']
        emp.marital_status = emp_data['marital_status']
        emp.jopt = emp_data['jopt']
        emp.joindate = emp_data['joindate']
        emp.form_sent = emp_data['form_sent']


        if emp_data['suprid']:
            emp.suprid = get_object_or_404(Super, suprid=emp_data['suprid'])
        else:
            emp.suprid = None
        
        if emp_data['statsid']:
            emp.statsid = get_object_or_404(Statemp, statsid=emp_data['statsid'])
        else:
            emp.statsid = None
        
        if emp_data['deptid']:
            emp.deptid = get_object_or_404(Dept, deptid=emp_data['deptid'])
        else:
            emp.deptid = None

        try:
            emp.save()
        except IntegrityError as e:
            print("IntegrityError:", e)
            return JsonResponse({'success': False, 'message': str(e)}, status=400)

        return JsonResponse({
            'success': True,
            'message': 'Employee updated successfully',
            'emp': emp_data
        })

    return JsonResponse({'success': False, 'message': 'Invalid request method'}, status=400)

def login_user(request):
    if request.method == 'POST':
        form = CustomLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('index')  
    else:
        form = CustomLoginForm()
    
    return render(request, 'login.html', {'form': form})

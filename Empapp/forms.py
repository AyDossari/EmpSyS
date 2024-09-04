from django import forms
from django.forms import ModelForm
from .models import Emp, Super, Statemp, Dept
from django.contrib.auth.forms import UserCreationForm ,AuthenticationForm
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings

class EmpForm(ModelForm):
    suprid = forms.ModelChoiceField(
        queryset=Super.objects.all(),
        widget=forms.Select(attrs={'id': 'suprid', 'class': 'form-select'}),
        empty_label='Select Supervisor'
    )
    statsid = forms.ModelChoiceField(
        queryset=Statemp.objects.all(),
        widget=forms.Select(attrs={'id': 'statsid', 'class': 'form-select'}),
        empty_label='Select Status'
    )

    deptid = forms.ModelChoiceField(
        queryset=Dept.objects.all(),
        widget=forms.Select(attrs={'id': 'deptid','class': 'form-select'}),
        empty_label='Select Department'
    )
    class Meta:
        model = Emp
        fields = '__all__'  

    def __init__(self, *args, **kwargs):
        super(EmpForm, self).__init__(*args, **kwargs)
        
        self.fields['empidn'].widget.attrs.update({'class': 'form-control border-primary-subtle', 'placeholder': '1xxxxxxxx9' ,'id': 'empidn', 'type':'text'})
        self.fields['empname_eng'].widget.attrs.update({'class': 'form-control border-primary-subtle', 'placeholder': 'Enter Name in English','id': 'empname_eng'})
        self.fields['empnumber'].widget.attrs.update({'class': 'form-control border-primary-subtle', 'placeholder': '+996xxxxxxxxx','id': 'empnumber'})
        self.fields['othernumber'].widget.attrs.update({'class': 'form-control border-primary-subtle', 'placeholder': '+996xxxxxxxxx', 'id': 'othernumber'})
        self.fields['empemail'].widget.attrs.update({'class': 'form-control border-primary-subtle', 'placeholder': 'mail@example.com', 'id': 'empemail'})        
        self.fields['birth_date'].widget = forms.TextInput(attrs={'type': 'date', 'class': 'form-control'})
        self.fields['city'].widget.attrs.update({'id': 'city','class': 'form-select', 'placeholder': 'Enter City'})
        self.fields['gender'].widget.attrs.update({'id': 'gender','class': 'form-select'})
        self.fields['marital_status'].widget.attrs.update({ 'id': 'marital_status','class': 'form-select','placeholder': 'Select'})
        self.fields['jopt'].widget.attrs.update({'id': 'jopt' ,'class': 'form-control', 'placeholder': 'Enter Job Title'})
        self.fields['joindate'].widget = forms.TextInput(attrs={'id': 'joindate' ,'type': 'date', 'class': 'form-control'})        
        form_sent = forms.BooleanField(required=False, widget=forms.CheckboxInput(attrs={'id': 'form_sent', 'class': 'form-check-input'}))



def save(self, commit=True):
    instance = super(EmpForm, self).save(commit=False)    
    if commit:
        instance.save()
    return instance
   
    

class CustomLoginForm(AuthenticationForm):
    username = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'form-control'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'form-control'}))
    

from django.contrib import admin
from .models import Super, Statemp, Dept , Emp
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

class SuperAdmin(admin.ModelAdmin):
    list_display = ('suprid', 'supname', 'supnumber')  
    search_fields = ('supname', 'supnumber')  

class StatempAdmin(admin.ModelAdmin):
    list_display = ('statsid', 'stutsname') 
    search_fields = ('stutsname',) 

class DeptAdmin(admin.ModelAdmin):
    list_display = ('deptid', 'deptname')
    search_fields = ('deptname',)

class EmpAdmin(admin.ModelAdmin):
    list_display = ('empid', 'empname_eng')
    search_fields = ('empname_eng',)  


class CustomUserAdmin(UserAdmin):
   
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password','suprid')}),
        ('Permissions', {'fields': ('is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)   
admin.site.register(Emp,EmpAdmin)
admin.site.register(Dept,DeptAdmin)
admin.site.register(Super, SuperAdmin)
admin.site.register(Statemp, StatempAdmin)
# Register your models here.

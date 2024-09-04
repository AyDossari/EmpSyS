from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator



class Dept(models.Model):
    deptid = models.AutoField(primary_key=True)
    deptname = models.CharField(max_length=255, default='Default Department', verbose_name=_("Department"))

    class Meta:
        verbose_name = _("Department")
        verbose_name_plural = _("Departments")

    def __str__(self):
        return self.deptname
    
class Super(models.Model):
    suprid = models.AutoField(primary_key=True)
    supname = models.CharField(
        max_length=100,
        error_messages={'required': _('Supervisor Name is required')}
    )
    supnumber = models.CharField(
        max_length=20
    )

    def __str__(self):
        return self.supname
    
    class Meta:
        verbose_name = _("Supervisor")
        verbose_name_plural = _("Supervisors")

class Statemp(models.Model):
    statsid = models.AutoField(primary_key=True)
    stutsname = models.CharField(max_length=255)

    def __str__(self):
        return self.stutsname
    
    class Meta:
        verbose_name = _("Employee Status")
        verbose_name_plural = _("Employee Statuses")


class Emp(models.Model):
    empid = models.AutoField(primary_key=True)
    empidn = models.PositiveIntegerField(
        validators=[RegexValidator(r'^[0-9]{10}$', _('Please make sure your national ID is a 10-digit number.'))]
    )
    empname_eng = models.CharField(
        max_length=255,
    )
    empnumber = models.CharField(
        max_length=20,
        validators=[RegexValidator(r'^05[0-9]{8}$', _('Entered phone format is not valid. Must be a 10-digit number starting with 05.'))]
    )
    othernumber = models.CharField(
        max_length=20,
        validators=[RegexValidator(r'^05[0-9]{8}$', _('Entered phone format is not valid. Must be a 10-digit number starting with 05.'))]
    )
    empemail = models.EmailField(
        validators=[RegexValidator(r'^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$', _('Please enter a valid e-mail address.'))]
    )
    birth_date = models.DateField(
        verbose_name=_("Date of Birth"),
        help_text=_("Enter the employee's date of birth")
    )

    CITIES_CHOICES = [
        ('Riyadh', _('Riyadh')),
        ('Jeddah', _('Jeddah')),
        ('Dammam', _('Dammam')),
        ('Khobar', _('Khobar')),
        ('Mecca', _('Mecca')),
        ('Medina', _('Medina')),
        ('Dhahran', _('Dhahran')),
        ('Buraidah', _('Buraidah')),
        ('Abha', _('Abha')),
        ('Khamis Mushait', _('Khamis Mushait')),
        ('Najran', _('Najran')),
        ('Hail', _('Hail')),
        ('Jizan', _('Jizan')),
        ('Jubail', _('Jubail')),
        ('Tabuk', _('Tabuk')),
        ('Sakaka', _('Sakaka')),
        ('Al Khobar', _('Al Khobar')),
        ('Yanbu', _('Yanbu')),
        ('Arar', _('Arar')),
        ('Qatif', _('Qatif')),
        ('Al Bahah', _('Al Bahah')),
        ('Al Ahsa', _('Al Ahsa')),
        ('Al Mubarraz', _('Al Mubarraz')),
        ('Sharurah', _('Sharurah')),
        ('Wadi ad-Dawasir', _('Wadi ad-Dawasir')),
        ('Al Kharj', _('Al Kharj')),
        ('Ras Tanura', _('Ras Tanura')),
        ('Al Jubail', _('Al Jubail')),
        ('Abqaiq', _('Abqaiq')),
        ('Al Qurayyat', _('Al Qurayyat')),
        ('Al Namas', _('Al Namas')),
        ('Al-Muwaih', _('Al-Muwaih')),
        ('Umluj', _('Umluj')),
        ('Al Khobar', _('Al Khobar')),
        ('Al Ula', _('Al Ula')),
        ('Al Artawiyah', _('Al Artawiyah')),
        ('Bisha', _('Bisha')),
        ('Khaybar', _('Khaybar')),
    ]
    city = models.CharField(
        max_length=30,
        choices=CITIES_CHOICES,
        verbose_name=_("City"),
        default='Riyadh',
        help_text=_("Select the employee's city")
    )

    GENDER_CHOICES = [
        ('M', _('Male')),
        ('F', _('Female')),
        ('O', _('Other')),
    ]
    
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        verbose_name=_("Gender"),
        help_text=_("Select the employee's gender")
    )
    MARITAL_STATUS_CHOICES = [
        ('S', _('Single')),
        ('M', _('Married')),
    ]
    
    marital_status = models.CharField(
        max_length=1,
        choices=MARITAL_STATUS_CHOICES,
        default='S',
        verbose_name=_("Marital Status"),
        help_text=_("Select the employee's marital status")
    )
    
    jopt = models.CharField(max_length=255, blank=True, null=True)
    suprid = models.ForeignKey(Super, on_delete=models.CASCADE)
    statsid = models.ForeignKey(Statemp, on_delete=models.CASCADE)
    deptid = models.ForeignKey(Dept, on_delete=models.CASCADE)
    joindate = models.DateField()
    form_sent = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("Employee")
        verbose_name_plural = _("Employees")
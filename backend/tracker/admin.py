from django.contrib import admin
from .models import Category, Transaction , MonthlyBudget
# Register your models here.


admin.site.register(Category)
admin.site.register(Transaction)
admin.site.register(MonthlyBudget)

from django.urls import path 
from .views import (
    CategoryListCreate, TransactionListCreate, CategoryDetail, TransactionDetail,
    MonthlyBudgetListCreate, MonthlyBudgetDetail, CustomTokenObtainPairView,SignupView
)

urlpatterns = [
    path('categories/', CategoryListCreate.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetail.as_view(), name='category-detail'),
    path('transactions/', TransactionListCreate.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', TransactionDetail.as_view(), name='transaction-detail'),
    path('budgets/', MonthlyBudgetListCreate.as_view(), name='budget-list-create'),
    path('budgets/<int:pk>/', MonthlyBudgetDetail.as_view(), name='budget-detail'),

    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/signup/', SignupView.as_view(), name='signup'),

]

from django.shortcuts import render
from rest_framework import generics 
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Category, Transaction , MonthlyBudget
from .serializers import CategorySerializer , TransactionSerializer ,MonthlyBudgetSerializer,CustomTokenObtainPairSerializer,UserSignupSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class CategoryListCreate(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class TransactionListCreate(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class MonthlyBudgetListCreate(generics.ListCreateAPIView):
    queryset = MonthlyBudget.objects.all()
    serializer_class = MonthlyBudgetSerializer

class MonthlyBudgetDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MonthlyBudget.objects.all()
    serializer_class = MonthlyBudgetSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class SignupView(APIView):

    def post(self, request):
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
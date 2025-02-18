from django.urls import path, include
from app import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # path('', views.index),
    path('', views.upload),
    # path('', views.ProductView.as_view(), name='product-detail'),
    # path('product-detail/<int:pk>', views.ProductDetailView.as_view(), name='product-detail'),
    # path('add-to-cart/<product_id>/', views.add_to_cart, name='add-to-cart'),
    # path('cart/', views.cart, name='cart'),
    # path('plus-cart/', views.plus_cart, name='plus_cart'),
    # path('minus-cart/', views.minus_cart, name='minus_cart'),
    # path('remove-from-cart/', views.remove_from_cart, name='remove_from_cart'),
    
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
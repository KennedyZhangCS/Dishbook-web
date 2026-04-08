from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, redirect, render

from .models import Profile, Recipe


def index(request):
    # Start with public recipes only so logged-out users do not see private data.
    # select_related("author") tells Django to fetch the linked author data
    # at the same time, which helps avoid extra database queries in templates.
    recipes = Recipe.objects.filter(is_public=True).select_related("author")[:6]

    # Render the home page and give the template the recipes to display.
    return render(request, "index.html", {"recipes": recipes})


def recipe(request, recipe_id):
    # Look up one recipe by its id.
    # If no such recipe exists, Django will automatically return a 404 page.
    selected_recipe = get_object_or_404(
        Recipe.objects.select_related("author"),
        id=recipe_id
    )

    # Send the selected recipe to the recipe detail template.
    return render(request, "recipe.html", {"recipe": selected_recipe})


def search(request):
    # Read the search query from the URL, like /s?q=toast.
    # If q is missing, use the empty string instead.
    # strip() removes extra spaces from the beginning and end.
    q = request.GET.get("q", "").strip()

    # Begin with all public recipes.
    recipes = Recipe.objects.filter(is_public=True).select_related("author")

    # TODO - add filtering of recipes
    if q:
        recipes = recipes.filter(title__icontains=q)

    # Render the search page with both:
    # - the recipes to show
    # - the original query, so the search box can keep its value
    return render(request, "search.html", {"recipes": recipes, "query": q})


def profile(request, username):
    # Find the user whose profile page we want to show.
    # If the username does not exist, return a 404 page.
    author = get_object_or_404(User, username=username)

    # Find that user's associated profile object.
    profile_data = get_object_or_404(Profile, user=author)

    # Show that user's public recipes on the profile page.
    recipes = Recipe.objects.filter(author=author, is_public=True).select_related("author")

    # Render the profile page with the user, profile, and recipes.
    return render(
        request,
        "profile.html",
        {
            "author": author,
            "profile": profile_data,
            "recipes": recipes,
        },
    )


def signin(request):
    # Assume there is no login error unless we discover one.
    error = False

    # If the user submitted the login form, process it.
    if request.method == "POST":
        # Read username and password from the submitted form data.
        username = request.POST.get("username", "")
        password = request.POST.get("password", "")

        # Ask Django to check whether these credentials are valid.
        user = authenticate(request, username=username, password=password)

        # If authentication succeeds, log the user in and send them home.
        if user is not None:
            login(request, user)
            return redirect("/")

        # Otherwise, keep them on the login page and show an error message.
        error = True

    # For a normal GET request, or for a failed login attempt,
    # render the login page.
    return render(request, "login.html", {"error": error})


def signout(request):
    # Log out the current user.
    logout(request)

    # Send them back to the login page.
    return redirect("/login")
# Code Snippets

### Return a ReadOnly

```csharp
 public IReadOnlyList<Book> GetBorrowedBooks()
 {
     // TODO: return a read‑only view of _borrowed (e.g. _borrowed.AsReadOnly()).
     return _borrowed.AsReadOnly().AsReadOnly();
 }
```

### Check if any borrowed book has the given title (case‑insensitive).

```csharp
public bool HasBorrowed(string title)
{
    if (string.IsNullOrWhiteSpace(title))
        return false;
    // TODO: check if any borrowed book has the given title (case‑insensitive).
    if (_borrowed.Any(b => b.Title.Equals(title, StringComparison.OrdinalIgnoreCase)))
        return true;
    return false;
}
```

### Implement a lazy, eager or simplest possible Singleton pattern.

```csharp
public class SearchEngine
{
    private static readonly SearchEngine _instance = new SearchEngine();
    public static SearchEngine Instance => _instance;

    private SearchEngine()
    {
    }
}
```

### Return the correct concrete provider based on the kind.

```csharp
 public ISuggestionProvider CreateProvider(RecommendationKind kind)
 {
     switch (kind)
     {
         case RecommendationKind.LatestBooks:
             return new LatestBooksSuggestionProvider(_catalog);
         case RecommendationKind.GenreRecommendations:
             return new GenreRecommendationProvider(_catalog);
         default:
             throw new ArgumentOutOfRangeException(nameof(kind), $"Unsupported recommendation kind: {kind}");
     }
 }
```

### Suggest up to the last 3 books added to the catalog.

```csharp
public IReadOnlyList<SuggestionItem> GetSuggestions(string userName)
{
    var reccommendations = _catalog.GetAllBooks()
        .TakeLast(3)
        .Select(book => new SuggestionItem
        (
            book.Title,
            "New arrival"
        ))
        .ToList();
    return reccommendations;
}
```

### GenreRecommendationProvider

```csharp
public IReadOnlyList<SuggestionItem> GetSuggestions(string userName)
{

    var user = _catalog.FindUser(userName);

    if (user is null)
    {
        return Array.Empty<SuggestionItem>();
    }

    var borrowedGenres = user.GetBorrowedBooks()
        .Select(book => book.Genre)
        .Distinct()
        .ToHashSet();

    var alreadyBorrowedBookIds = user.GetBorrowedBooks()
        .Select(book => book.Title)
        .ToHashSet();

    var recommendations = _catalog.GetAllBooks()
        .Where(book => borrowedGenres.Contains(book.Genre) &&
                       !alreadyBorrowedBookIds.Contains(book.Title))
        .Take(3)
        .Select(book => new SuggestionItem
        (
            book.Title,
            $"Because you like {book.Genre}"
        ))
        .ToList();
    return recommendations;
}
```

###

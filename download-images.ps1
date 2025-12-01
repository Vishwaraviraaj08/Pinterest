$images = @(
    @{url='https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=600'; name='beach.jpg'},
    @{url='https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&h=400'; name='mountain.jpg'},
    @{url='https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300'; name='building.jpg'},
    @{url='https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&h=500'; name='flowers.jpg'},
    @{url='https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400'; name='fruits.jpg'},
    @{url='https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300'; name='forest.jpg'},
    @{url='https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=500'; name='tropical.jpg'},
    @{url='https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&h=400'; name='contemporary.jpg'},
    @{url='https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=400&h=300'; name='citrus.jpg'},
    @{url='https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=300&h=500'; name='architecture.jpg'},
    @{url='https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400&h=400'; name='meadow.jpg'},
    @{url='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300'; name='landscape.jpg'},
    @{url='https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=400&h=600'; name='lake.jpg'},
    @{url='https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=400'; name='palms.jpg'},
    @{url='https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300'; name='berries.jpg'},
    @{url='https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&h=500'; name='skyline.jpg'},
    @{url='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=400'; name='garden.jpg'},
    @{url='https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=300&h=300'; name='reflection.jpg'},
    @{url='https://images.unsplash.com/photo-1610878180933-123728745d22?w=400&h=500'; name='tropical-fruits.jpg'},
    @{url='https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=300&h=400'; name='urban.jpg'}
)

$outputDir = "client\public\images\landing"

foreach ($img in $images) {
    $outputPath = Join-Path $outputDir $img.name
    Write-Host "Downloading $($img.name)..."
    try {
        Invoke-WebRequest -Uri $img.url -OutFile $outputPath -UseBasicParsing
        Write-Host "Downloaded $($img.name)"
    } catch {
        Write-Host "Failed to download $($img.name)"
    }
}

Write-Host "Done"

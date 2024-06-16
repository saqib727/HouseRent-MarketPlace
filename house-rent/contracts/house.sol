// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract house {
    //Variables
    struct Property {
        uint256 productid;
        address owner;
        uint256 price;
        string propertyTitle;
        string category;
        string images;
        string propertyAddress;
        string description;
        address[] reviwers;
        string[] reviews;
    }
    struct Review {
        address reviewer;
        uint256 productid;
        uint256 rating;
        string comment;
        uint256 likes;
    }

    struct Product {
        uint256 productid;
        uint256 totalRating;
        uint256 numReviews;
    }

    //Mapping
    mapping(uint256 => Property) private properties;
    uint256 public propertyIndex; //track of number of properties
    mapping(uint256 => Review[]) private reviews;

    mapping(address => uint256[]) private userReviews;
    mapping(uint256 => Product) private products;
    uint256 public reviewsCounter;

    event ReviewAdded(
        uint256 indexed productid,
        address indexed reviewer,
        uint256 rating,
        string comment
    );
    event ReviewLiked(
        uint256 indexed productid,
        uint256 indexed reviewIndex,
        address indexed liker,
        uint256 likes
    );

    //Events
    event PropertyListed(
        uint256 indexed id,
        address indexed owner,
        uint256 price
    );
    event PropertySold(
        uint256 indexed id,
        address indexed oldOwner,
        address indexed newOwner,
        uint256 price
    );
    event PropertyReSold(
        uint256 indexed id,
        address indexed oldowner,
        address indexed newOwner,
        uint256 price
    );

    function listproperty(
        address owner,
        uint256 price,
        string memory _propertytitle,
        string memory _category,
        string memory _images,
        string memory _propertyAddress,
        string memory _description
    ) external returns (uint256) {
        require(price > 0, "Price Must be Greater than 0.");
        uint256 productID = propertyIndex++;
        Property storage property = properties[productID];
        property.productid = productID;
        property.price = price;
        property.owner = owner;
        property.propertyTitle = _propertytitle;
        property.category = _category;
        property.images = _images;
        property.propertyAddress = _propertyAddress;
        property.description = _description;

        emit PropertyListed(productID, owner, price);

        return productID;
    }

    function updateProperty(
        address owner,
        uint256 productid,
        string memory _propertytitle,
        string memory _category,
        string memory _images,
        string memory _propertyAddress,
        string memory _description
    ) external returns (uint256) {
        Property storage property = properties[productid];
        require(property.owner == owner, "Your are not the Owner");
        property.propertyTitle = _propertytitle;
        property.category = _category;
        property.images = _images;
        property.propertyAddress = _propertyAddress;
        property.description = _description;

        return productid;
    }

    function updatePrice(
        address owner,
        uint256 productid,
        uint256 price
    ) external returns (string memory) {
        Property storage property = properties[productid];
        require(property.owner == owner, "Your are not the Owner");
        property.price = price;

        return "Your Property price is updated";
    }

    function buyproperty(address buyer, uint256 productID) external payable {
        uint256 amount = msg.value;

        require(
            amount >= properties[productID].price,
            "Amount to buy Property is low"
        );
        Property storage property = properties[productID];

        (bool sent, ) = payable(property.owner).call{value: amount}("");
        if (sent) {
            property.owner = buyer;
            emit PropertySold(productID, property.owner, buyer, amount);
        }
    }

    function getAllProperty() public view returns (Property[] memory) {
        
        uint256 itemcount = propertyIndex;
        uint256 currentIndex = 0;

        Property[] memory items = new Property[](itemcount);

        for (uint256 i = 0; i < itemcount; i++) {
            uint256 currentid = i;
            Property storage currentItem = properties[currentid];
            items[currentIndex] = currentItem;
            currentIndex += 1;
        }
        return items;
    }

    function getProperty(
        uint256 productid
    )
        external
        view
        returns (
            uint256,
            address,
            uint256,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        Property storage property = properties[productid];
        return (
            property.productid,
            property.owner,
            property.price,
            property.propertyTitle,
            property.category,
            property.images,
            property.propertyAddress,
            property.description
        );
    }

    function getUserProperties(
        address user
    ) external view returns (Property[] memory) {
        uint256 totalitems = propertyIndex;
        uint256 itemcount = 0;
        uint256 currentindex = 0;

        for (uint256 i = 0; i < totalitems; i++) {
            if (properties[i].owner == user) {
                itemcount += 1;
            }
        }
        Property[] memory item = new Property[](itemcount);
        for (uint256 i = 0; i < totalitems; i++) {
            if (properties[i].owner == user) {
                Property storage currentitem = properties[i];

                item[currentindex] = currentitem;
                currentindex += 1;
            }
        }
        return item;
    }

    function addReview(
        uint256 productid,
        uint256 rating,
        string calldata comment,
        address user
    ) external {
        require(
            rating >= 1 && rating <= 5,
            "Rating must be in between 1 and 5"
        );

        Property storage property = properties[productid];

        property.reviwers.push(user);
        property.reviews.push(comment);

        //reviewsection
        reviews[productid].push(Review(user, productid, rating, comment, 0));
        userReviews[user].push(productid);
        products[productid].totalRating += rating;
        products[productid].numReviews++;

        emit ReviewAdded(productid, user, rating, comment);
        reviewsCounter++;
    }

    function getProductReviews(
        uint256 productid
    ) external view returns (Review[] memory) {
        return reviews[productid];
    }

    function getUserReviews(
        address user
    ) external view returns (Review[] memory) {
        uint256 totalreviews = userReviews[user].length;
        Review[] memory userProductReviews = new Review[](totalreviews);
        for (uint256 i = 0; i < userReviews[user].length; i++) {
            uint256 productid = userReviews[user][i];
            Review[] memory productreview = reviews[productid];

            for (uint256 j = 0; j < productreview.length; j++) {
                if (productreview[j].reviewer == user) {
                    userProductReviews[i] = productreview[j];
                }
            }
        }
        return userProductReviews;
    }

    function LikeReview(
        uint256 productid,
        uint256 reviewindex,
        address user
    ) external {
        Review storage review = reviews[productid][reviewindex];
        review.likes++;
        emit ReviewLiked(productid, reviewindex, user, review.likes);
    }

    function gethighestratedProduct() external view returns (uint256) {
        uint256 highestRating = 0;
        uint256 highestRateproductid = 0;
        for (uint256 i = 0; i < propertyIndex; i++) {
            uint256 productid = i;
            if (products[productid].numReviews > 0) {
                uint256 avgrating = products[productid].totalRating /
                    products[productid].numReviews;

                if (avgrating > highestRating) {
                    highestRating = avgrating;
                    highestRateproductid = productid;
                }
            }
        }
        return highestRateproductid;
    }                            
}

package com.example.DemoHotelBooking.util;

import com.example.DemoHotelBooking.entity.*;
import com.example.DemoHotelBooking.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomCategoryRepository roomCategoryRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private PromotionRepository promotionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Initializing Seed Data...");

        // 1. Seed Users
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .name("Hotel Admin")
                    .email("admin@hotel.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("+1-111-222-3333")
                    .role("ADMIN")
                    .build();

            User customer = User.builder()
                    .name("John Doe")
                    .email("customer@hotel.com")
                    .password(passwordEncoder.encode("customer123"))
                    .phone("+1-444-555-6666")
                    .role("CUSTOMER")
                    .build();

            userRepository.saveAll(Arrays.asList(admin, customer));
            logger.info("Seeded Admin (admin@hotel.com) and Customer (customer@hotel.com) users.");
        }

        // 2. Seed Amenities
        if (amenityRepository.count() == 0) {
            List<Amenity> amenities = Arrays.asList(
                    Amenity.builder().amenityName("Free High-Speed WiFi").build(),
                    Amenity.builder().amenityName("Infinity Swimming Pool").build(),
                    Amenity.builder().amenityName("Luxury Spa & Wellness").build(),
                    Amenity.builder().amenityName("Central Air Conditioning").build(),
                    Amenity.builder().amenityName("Complimentary Gourmet Breakfast").build(),
                    Amenity.builder().amenityName("Modern Fitness Center").build(),
                    Amenity.builder().amenityName("Scenic Ocean View").build(),
                    Amenity.builder().amenityName("Fully Stocked Mini Bar").build(),
                    Amenity.builder().amenityName("Flat-screen Smart TV").build(),
                    Amenity.builder().amenityName("24/7 Room Service").build()
            );
            amenityRepository.saveAll(amenities);
            logger.info("Seeded amenities list.");
        }

        List<Amenity> allAmenities = amenityRepository.findAll();

        // 3. Seed Room Categories
        if (roomCategoryRepository.count() == 0) {
            List<RoomCategory> categories = Arrays.asList(
                    RoomCategory.builder().categoryName("Standard Room").build(),
                    RoomCategory.builder().categoryName("Deluxe Room").build(),
                    RoomCategory.builder().categoryName("Executive Suite").build(),
                    RoomCategory.builder().categoryName("Presidential Penthouse").build()
            );
            roomCategoryRepository.saveAll(categories);
            logger.info("Seeded room categories.");
        }

        List<RoomCategory> allCategories = roomCategoryRepository.findAll();
        RoomCategory standardCat = allCategories.stream().filter(c -> c.getCategoryName().equals("Standard Room")).findFirst().orElse(allCategories.get(0));
        RoomCategory deluxeCat = allCategories.stream().filter(c -> c.getCategoryName().equals("Deluxe Room")).findFirst().orElse(allCategories.get(0));
        RoomCategory suiteCat = allCategories.stream().filter(c -> c.getCategoryName().equals("Executive Suite")).findFirst().orElse(allCategories.get(0));
        RoomCategory penthouseCat = allCategories.stream().filter(c -> c.getCategoryName().equals("Presidential Penthouse")).findFirst().orElse(allCategories.get(0));

        // 4. Seed Hotels
        if (hotelRepository.count() == 0) {
            Hotel hotel1 = Hotel.builder()
                    .hotelName("Grand Palace Resort & Spa")
                    .location("Miami, FL")
                    .description("Experience absolute luxury with direct beach access, multi-cuisine gourmet dining, and a world-class infinity pool overlooking the Atlantic.")
                    .build();

            Hotel hotel2 = Hotel.builder()
                    .hotelName("The Manhattan Heights Hotel")
                    .location("New York, NY")
                    .description("A sleek, modern tower rising above Midtown Manhattan, featuring a panoramic rooftop sky lounge, fine Italian dining, and swift access to Broadway theaters.")
                    .build();

            Hotel hotel3 = Hotel.builder()
                    .hotelName("Alpine Heights Mountain Lodge")
                    .location("Denver, CO")
                    .description("Escape to our cozy timber-framed lodge featuring rustic fieldstone fireplaces, heated outdoor thermal pools, and ski-in/ski-out convenience.")
                    .build();

            Hotel hotel4 = Hotel.builder()
                    .hotelName("Tropical Bay Sands")
                    .location("Honolulu, HI")
                    .description("Enclosed by palm trees and crystalline waters, this Hawaiian paradise offers private beachside cabanas, surf lessons, and authentic Polynesian luaus.")
                    .build();

            Hotel hotel5 = Hotel.builder()
                    .hotelName("Celestial Crown Hotel")
                    .location("Chicago, IL")
                    .description("Step into timeless elegance at our heritage-inspired retreat featuring royal suites, rooftop candlelight dining, a luxury spa, and breathtaking city skyline views.")
                    .build();

            Hotel hotel6 = Hotel.builder()
                    .hotelName("Silver Oak Vineyard Resort")
                    .location("Napa Valley, CA")
                    .description("Nestled beside tranquil vineyards and rolling hills, this countryside escape offers wine tasting tours, organic farm-to-table cuisine, and private jacuzzi villas.")
                    .build();

            Hotel hotel7 = Hotel.builder()
                    .hotelName("Azure Mirage Resort")
                    .location("Phoenix, AZ")
                    .description("Experience futuristic comfort in our ultra-modern desert oasis with smart suites, rooftop infinity pools, live entertainment arenas, and stunning sunset dune views.")
                    .build();

            hotelRepository.saveAll(Arrays.asList(hotel1, hotel2, hotel3, hotel4, hotel5, hotel6, hotel7));
            logger.info("Seeded hotels.");
        }

        List<Hotel> allHotels = hotelRepository.findAll();

        // 5. Seed Rooms
        if (roomRepository.count() == 0) {
            // Seed Rooms for Grand Palace Resort (Hotel 0)
            Hotel miamiHotel = allHotels.get(0);
            roomRepository.save(Room.builder()
                    .hotel(miamiHotel)
                    .category(standardCat)
                    .roomNumber("M-101")
                    .price(BigDecimal.valueOf(129.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(3), allAmenities.get(8)))
                    .build());
            roomRepository.save(Room.builder()
                    .hotel(miamiHotel)
                    .category(deluxeCat)
                    .roomNumber("M-202")
                    .price(BigDecimal.valueOf(189.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(3), allAmenities.get(4), allAmenities.get(6), allAmenities.get(8)))
                    .build());
            roomRepository.save(Room.builder()
                    .hotel(miamiHotel)
                    .category(suiteCat)
                    .roomNumber("M-303")
                    .price(BigDecimal.valueOf(349.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(1), allAmenities.get(2), allAmenities.get(3), allAmenities.get(4), allAmenities.get(5), allAmenities.get(6), allAmenities.get(7), allAmenities.get(8), allAmenities.get(9)))
                    .build());

            // Seed Rooms for The Manhattan Heights (Hotel 1)
            Hotel nyHotel = allHotels.get(1);
            roomRepository.save(Room.builder()
                    .hotel(nyHotel)
                    .category(standardCat)
                    .roomNumber("NY-505")
                    .price(BigDecimal.valueOf(149.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(3), allAmenities.get(8)))
                    .build());
            roomRepository.save(Room.builder()
                    .hotel(nyHotel)
                    .category(deluxeCat)
                    .roomNumber("NY-606")
                    .price(BigDecimal.valueOf(229.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(3), allAmenities.get(4), allAmenities.get(5), allAmenities.get(8), allAmenities.get(9)))
                    .build());

            // Seed Rooms for Alpine Heights (Hotel 2)
            Hotel denverHotel = allHotels.get(2);
            roomRepository.save(Room.builder()
                    .hotel(denverHotel)
                    .category(deluxeCat)
                    .roomNumber("A-102")
                    .price(BigDecimal.valueOf(199.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(4), allAmenities.get(5), allAmenities.get(9)))
                    .build());
            roomRepository.save(Room.builder()
                    .hotel(denverHotel)
                    .category(suiteCat)
                    .roomNumber("A-204")
                    .price(BigDecimal.valueOf(399.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(1), allAmenities.get(2), allAmenities.get(4), allAmenities.get(5), allAmenities.get(7), allAmenities.get(9)))
                    .build());

            // Seed Rooms for Tropical Bay Sands (Hotel 3)
            Hotel hawaiiHotel = allHotels.get(3);
            roomRepository.save(Room.builder()
                    .hotel(hawaiiHotel)
                    .category(deluxeCat)
                    .roomNumber("H-110")
                    .price(BigDecimal.valueOf(259.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(3), allAmenities.get(4), allAmenities.get(6), allAmenities.get(8)))
                    .build());
            roomRepository.save(Room.builder()
                    .hotel(hawaiiHotel)
                    .category(penthouseCat)
                    .roomNumber("H-VIP")
                    .price(BigDecimal.valueOf(899.99))
                    .availabilityStatus(true)
                    .amenities(allAmenities) // VIP Penthouse has all amenities
                    .build());

            // Seed Rooms for Celestial Crown Hotel (Hotel 4)
            Hotel chicagoHotel = allHotels.get(4);
            roomRepository.save(Room.builder()
                    .hotel(chicagoHotel)
                    .category(standardCat)
                    .roomNumber("C-101")
                    .price(BigDecimal.valueOf(159.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(3), allAmenities.get(8)))
                    .build());
            roomRepository.save(Room.builder()
                    .hotel(chicagoHotel)
                    .category(deluxeCat)
                    .roomNumber("C-202")
                    .price(BigDecimal.valueOf(239.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(3), allAmenities.get(4), allAmenities.get(8), allAmenities.get(9)))
                    .build());
            roomRepository.save(Room.builder()
                    .hotel(chicagoHotel)
                    .category(suiteCat)
                    .roomNumber("C-303")
                    .price(BigDecimal.valueOf(429.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(1), allAmenities.get(2), allAmenities.get(3), allAmenities.get(4), allAmenities.get(7), allAmenities.get(8), allAmenities.get(9)))
                    .build());

            // Seed Rooms for Silver Oak Vineyard Resort (Hotel 5)
            Hotel napaHotel = allHotels.get(5);
            roomRepository.save(Room.builder()
                    .hotel(napaHotel)
                    .category(deluxeCat)
                    .roomNumber("SO-101")
                    .price(BigDecimal.valueOf(299.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(2), allAmenities.get(4), allAmenities.get(7), allAmenities.get(9)))
                    .build());
            roomRepository.save(Room.builder()
                    .hotel(napaHotel)
                    .category(suiteCat)
                    .roomNumber("SO-202")
                    .price(BigDecimal.valueOf(549.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(2), allAmenities.get(3), allAmenities.get(4), allAmenities.get(7), allAmenities.get(8), allAmenities.get(9)))
                    .build());

            // Seed Rooms for Azure Mirage Resort (Hotel 6)
            Hotel phoenixHotel = allHotels.get(6);
            roomRepository.save(Room.builder()
                    .hotel(phoenixHotel)
                    .category(deluxeCat)
                    .roomNumber("AM-101")
                    .price(BigDecimal.valueOf(209.99))
                    .availabilityStatus(true)
                    .amenities(Arrays.asList(allAmenities.get(0), allAmenities.get(3), allAmenities.get(8), allAmenities.get(9)))
                    .build());
            roomRepository.save(Room.builder()
                    .hotel(phoenixHotel)
                    .category(penthouseCat)
                    .roomNumber("AM-VIP")
                    .price(BigDecimal.valueOf(999.99))
                    .availabilityStatus(true)
                    .amenities(allAmenities)
                    .build());

            logger.info("Seeded rooms matching amenities and categories.");
        }

        // 6. Seed Promotions
        if (promotionRepository.count() == 0) {
            List<Promotion> promotions = Arrays.asList(
                    Promotion.builder()
                            .promoCode("WELCOME10")
                            .discountPercentage(BigDecimal.valueOf(10.0))
                            .startDate(LocalDate.now().minusDays(5))
                            .endDate(LocalDate.now().plusYears(1))
                            .build(),
                    Promotion.builder()
                            .promoCode("SUPERDEAL")
                            .discountPercentage(BigDecimal.valueOf(20.0))
                            .startDate(LocalDate.now())
                            .endDate(LocalDate.now().plusMonths(6))
                            .build(),
                    Promotion.builder()
                            .promoCode("SUMMER30")
                            .discountPercentage(BigDecimal.valueOf(30.0))
                            .startDate(LocalDate.now())
                            .endDate(LocalDate.now().plusMonths(3))
                            .build()
            );
            promotionRepository.saveAll(promotions);
            logger.info("Seeded promotions list.");
        }

        logger.info("Seed Data Initialization Completed Successfully.");
    }
}

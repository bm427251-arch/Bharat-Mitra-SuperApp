import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await LogoManager.instance.init();
  await ThemeManager.instance.init();
  runApp(const BharatMitraApp());
}

/// ===========================================================================
/// DYNAMIC THEME MANAGER & PERSISTENCE (Light / Dark Mode State Management)
/// ===========================================================================
class ThemeManager extends ChangeNotifier {
  static final ThemeManager instance = ThemeManager._internal();
  ThemeManager._internal();

  ThemeMode _themeMode = ThemeMode.light;
  ThemeMode get themeMode => _themeMode;
  bool get isDarkMode => _themeMode == ThemeMode.dark;

  Future<void> init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final isDark = prefs.getBool('is_dark_theme') ?? false;
      _themeMode = isDark ? ThemeMode.dark : ThemeMode.light;
      notifyListeners();
    } catch (e) {
      debugPrint('ThemeManager init error: $e');
    }
  }

  Future<void> toggleTheme() async {
    _themeMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('is_dark_theme', _themeMode == ThemeMode.dark);
    } catch (e) {
      debugPrint('Error saving theme preference: $e');
    }
  }
}

/// ===========================================================================
/// DYNAMIC LOGO MANAGER & PERSISTENCE (SharedPreferences + image_picker)
/// ===========================================================================
class LogoManager extends ChangeNotifier {
  static final LogoManager instance = LogoManager._internal();
  LogoManager._internal();

  String? _customLogoPath;
  String? get customLogoPath => _customLogoPath;

  Future<void> init() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _customLogoPath = prefs.getString('custom_app_logo_path');
      notifyListeners();
    } catch (e) {
      debugPrint('SharedPreferences init error: $e');
    }
  }

  Future<void> updateLogo(String path) async {
    _customLogoPath = path;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('custom_app_logo_path', path);
    } catch (e) {
      debugPrint('Error saving custom logo path: $e');
    }
  }

  Future<void> resetToDefault() async {
    _customLogoPath = null;
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('custom_app_logo_path');
    } catch (e) {
      debugPrint('Error clearing custom logo path: $e');
    }
  }
}

/// Reusable dynamic logo widget reflecting either custom uploaded image or default emblem
class AppLogoWidget extends StatelessWidget {
  final double size;
  final bool isSplash;
  final VoidCallback? onLongPress;

  const AppLogoWidget({
    super.key,
    this.size = 32,
    this.isSplash = false,
    this.onLongPress,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: LogoManager.instance,
      builder: (context, _) {
        final customPath = LogoManager.instance.customLogoPath;
        Widget logoContent;

        if (customPath != null && customPath.isNotEmpty) {
          logoContent = ClipRRect(
            borderRadius: BorderRadius.circular(size * 0.25),
            child: Image.file(
              File(customPath),
              width: size,
              height: size,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => _buildDefaultEmblem(),
            ),
          );
        } else {
          logoContent = _buildDefaultEmblem();
        }

        if (onLongPress != null) {
          return GestureDetector(
            onLongPress: onLongPress,
            child: logoContent,
          );
        }
        return logoContent;
      },
    );
  }

  Widget _buildDefaultEmblem() {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: const LinearGradient(
          colors: [Color(0xFFF58220), Color(0xFF0F8A3C)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: isSplash
            ? [
                BoxShadow(
                  color: const Color(0xFFF58220).withOpacity(0.35),
                  blurRadius: 18,
                  spreadRadius: 3,
                )
              ]
            : null,
      ),
      child: Center(
        child: Icon(
          Icons.handshake_rounded,
          color: Colors.white,
          size: size * 0.55,
        ),
      ),
    );
  }
}

/// ---------------------------------------------------------------------------
/// BHARAT MITRA - All-in-One Local Mobility & Service Super App
/// Built with Flutter & Material Design 3 (Clean Architecture, Zero Asset Conflicts)
/// ---------------------------------------------------------------------------
class BharatMitraApp extends StatelessWidget {
  const BharatMitraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: ThemeManager.instance,
      builder: (context, _) {
        return MaterialApp(
          title: 'BHARAT MITRA',
          debugShowCheckedModeBanner: false,
          themeMode: ThemeManager.instance.themeMode,
          theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFFF58220), // Divine Saffron
              primary: const Color(0xFFF58220),
              secondary: const Color(0xFF0F8A3C), // Divine Green
              tertiary: const Color(0xFF0B1B3D),  // Navy Blue
              surface: Colors.white,
              brightness: Brightness.light,
            ),
            scaffoldBackgroundColor: const Color(0xFFF8F9FA),
            appBarTheme: const AppBarTheme(
              centerTitle: true,
              elevation: 0,
              backgroundColor: Color(0xFF0B1B3D),
              foregroundColor: Colors.white,
              titleTextStyle: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.5,
              ),
            ),
            cardTheme: CardThemeData(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.grey.shade200),
              ),
              color: Colors.white,
            ),
            elevatedButtonTheme: ElevatedButtonThemeData(
              style: ElevatedButton.styleFrom(
                elevation: 0,
                backgroundColor: const Color(0xFFF58220),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              ),
            ),
          ),
          darkTheme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFFF58220),
              primary: const Color(0xFFF58220),
              secondary: const Color(0xFF0F8A3C),
              tertiary: const Color(0xFF0B1B3D),
              surface: const Color(0xFF1E293B),
              brightness: Brightness.dark,
            ),
            scaffoldBackgroundColor: const Color(0xFF0B1120),
            appBarTheme: const AppBarTheme(
              centerTitle: true,
              elevation: 0,
              backgroundColor: Color(0xFF0B1B3D),
              foregroundColor: Colors.white,
              titleTextStyle: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                letterSpacing: 0.5,
              ),
            ),
            cardTheme: CardThemeData(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.grey.shade800),
              ),
              color: const Color(0xFF1E293B),
            ),
            elevatedButtonTheme: ElevatedButtonThemeData(
              style: ElevatedButton.styleFrom(
                elevation: 0,
                backgroundColor: const Color(0xFFF58220),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
              ),
            ),
          ),
          home: const HomeScreen(),
        );
      },
    );
  }
}

/// ===========================================================================
/// 1. HOME DASHBOARD SCREEN (6 SERVICE MODULES + 3-TAP SECRET ADMIN TRIGGER)
/// ===========================================================================
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentNavIndex = 0;
  int _adminTapCount = 0;
  Timer? _adminTapResetTimer;

  // SECRET ADMIN ACCESS: Tap the title 3 times quickly to navigate to AdminLoginScreen
  void _handleTitleSecretTap() {
    _adminTapCount++;
    _adminTapResetTimer?.cancel();

    if (_adminTapCount >= 3) {
      _adminTapCount = 0;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('🔒 Secret Admin Triggered: Please Login with Authorized Email (bm427251@gmail.com)'),
          duration: Duration(seconds: 2),
          backgroundColor: Color(0xFF0F8A3C),
        ),
      );
      Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => const AdminLoginScreen()),
      );
    } else {
      _adminTapResetTimer = Timer(const Duration(milliseconds: 1200), () {
        _adminTapCount = 0;
      });
    }
  }

  final List<ServiceCardData> _services = const [
    ServiceCardData(
      title: 'Bike Taxi',
      subtitle: 'Quick local commute',
      icon: Icons.two_wheeler_rounded,
      badge: 'From ₹25',
      color: Color(0xFFF58220),
      screen: BikeTaxiScreen(),
    ),
    ServiceCardData(
      title: 'Auto-Rickshaw',
      subtitle: 'Affordable local travel',
      icon: Icons.electric_rickshaw_rounded,
      badge: 'From ₹40',
      color: Color(0xFF0F8A3C),
      screen: AutoRickshawScreen(),
    ),
    ServiceCardData(
      title: 'Cab / Ride',
      subtitle: '4-wheeler point-to-point',
      icon: Icons.local_taxi_rounded,
      badge: 'AC Available',
      color: Color(0xFF0B1B3D),
      screen: CabRideScreen(),
    ),
    ServiceCardData(
      title: 'Parcel Delivery',
      subtitle: 'Send packages & docs',
      icon: Icons.inventory_2_rounded,
      badge: 'Instant Pick',
      color: Color(0xFFE65100),
      screen: ParcelDeliveryScreen(),
    ),
    ServiceCardData(
      title: 'Rent a Car',
      subtitle: 'With Driver / Self-Drive',
      icon: Icons.directions_car_filled_rounded,
      badge: 'ড্রাইভার সহ',
      color: Color(0xFF2E7D32),
      screen: RentCarScreen(),
    ),
    ServiceCardData(
      title: 'Hire a Driver',
      subtitle: 'Verified personal chauffeur',
      icon: Icons.person_pin_circle_rounded,
      badge: 'From ₹79/hr',
      color: Color(0xFF1A237E),
      screen: HireDriverScreen(),
    ),
  ];

  @override
  void dispose() {
    _adminTapResetTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // SECRET ADMIN ACCESS: Tap the title 3 times quickly
        title: GestureDetector(
          onTap: _handleTitleSecretTap,
          behavior: HitTestBehavior.opaque,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const AppLogoWidget(size: 28),
              const SizedBox(width: 8),
              const Text(
                'BHARAT MITRA',
                style: TextStyle(fontWeight: FontWeight.w900, letterSpacing: 0.8),
              ),
            ],
          ),
        ),
        actions: [
          // Theme Toggle: Light / Dark Mode Switcher
          AnimatedBuilder(
            animation: ThemeManager.instance,
            builder: (context, _) => IconButton(
              icon: Icon(
                ThemeManager.instance.isDarkMode ? Icons.wb_sunny_rounded : Icons.dark_mode_rounded,
                color: ThemeManager.instance.isDarkMode ? const Color(0xFFFFD54F) : Colors.white,
              ),
              tooltip: ThemeManager.instance.isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
              onPressed: () {
                ThemeManager.instance.toggleTheme();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      ThemeManager.instance.isDarkMode
                          ? '🌙 Dark Mode Activated'
                          : '☀️ Light Mode Activated',
                    ),
                    duration: const Duration(seconds: 1),
                  ),
                );
              },
            ),
          ),
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text("No new notifications")),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Current Location Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  const Icon(Icons.location_on_rounded, color: Color(0xFF0F8A3C), size: 20),
                  const SizedBox(width: 8),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Your Location', style: TextStyle(fontSize: 11, color: Colors.grey)),
                        Text(
                          'Civil Lines & Railway Station Road',
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  TextButton(
                    onPressed: () {},
                    child: const Text('Change', style: TextStyle(color: Color(0xFFF58220), fontSize: 12)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Saffron Promoted Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFFF58220), Color(0xFFFFB366)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Ghar Se Station, Mandi Ya Khet',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Trusted local captains with zero surge on daily commutes.',
                          style: TextStyle(color: Colors.white, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                  Icon(Icons.local_shipping_outlined, color: Colors.white, size: 36),
                ],
              ),
            ),
            const SizedBox(height: 20),

            const Text(
              'Select a Service',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Color(0xFF0B1B3D)),
            ),
            const SizedBox(height: 12),

            // 6 Interactive Service Cards Grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                childAspectRatio: 1.15,
              ),
              itemCount: _services.length,
              itemBuilder: (context, index) {
                final item = _services[index];
                return InkWell(
                  onTap: () {
                    Navigator.push(context, MaterialPageRoute(builder: (_) => item.screen));
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: item.color.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Icon(item.icon, color: item.color, size: 24),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.grey.shade100,
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                item.badge,
                                style: const TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF0B1B3D),
                                ),
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.title,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: Color(0xFF0B1B3D),
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              item.subtitle,
                              style: TextStyle(fontSize: 11, color: Colors.grey.shade600),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 20),

            // Emergency SOS & Safety Banner
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.red.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.red.shade200),
              ),
              child: Row(
                children: [
                  const Icon(Icons.shield_rounded, color: Colors.red, size: 24),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'Bharat Mitra 24/7 Safety Assurance & GPS live sharing on all rides.',
                      style: TextStyle(fontSize: 12, color: Colors.red, fontWeight: FontWeight.w600),
                    ),
                  ),
                  OutlinedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Emergency SOS: Calling Police & Rapid Response')),
                      );
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.red,
                      side: const BorderSide(color: Colors.red),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    ),
                    child: const Text('SOS', style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentNavIndex,
        onDestinationSelected: (index) => setState(() => _currentNavIndex = index),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home_rounded), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.history_rounded), label: 'My Rides'),
          NavigationDestination(icon: Icon(Icons.account_balance_wallet_rounded), label: 'Wallet'),
          NavigationDestination(icon: Icon(Icons.person_rounded), label: 'Profile'),
        ],
      ),
    );
  }
}

class ServiceCardData {
  final String title;
  final String subtitle;
  final IconData icon;
  final String badge;
  final Color color;
  final Widget screen;

  const ServiceCardData({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.badge,
    required this.color,
    required this.screen,
  });
}

/// ===========================================================================
/// 1B. SECURE ADMIN LOGIN SCREEN (AUTHORIZED EMAIL: bm427251@gmail.com)
/// ===========================================================================
class AdminLoginScreen extends StatefulWidget {
  const AdminLoginScreen({super.key});

  @override
  State<AdminLoginScreen> createState() => _AdminLoginScreenState();
}

class _AdminLoginScreenState extends State<AdminLoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  String? _errorMessage;
  bool _isLoading = false;

  static const String _authorizedEmail = 'bm427251@gmail.com';

  void _handleAdminLogin() {
    setState(() {
      _errorMessage = null;
      _isLoading = true;
    });

    final email = _emailController.text.trim().toLowerCase();
    final password = _passwordController.text.trim();

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;

      if (email != _authorizedEmail) {
        setState(() {
          _isLoading = false;
          _errorMessage =
              'Unauthorized Admin: Access is strictly restricted to $_authorizedEmail.';
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Colors.red,
            content: Text(
                'Access Denied: Only authorized email (bm427251@gmail.com) can access the Admin Panel.'),
          ),
        );
        return;
      }

      if (password != '7788' && password != 'BharatAdmin@2026') {
        setState(() {
          _isLoading = false;
          _errorMessage =
              'Incorrect Security Password / PIN. Access denied.';
        });
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Colors.red,
            content: Text('Invalid Security PIN / Password. Please try again.'),
          ),
        );
        return;
      }

      setState(() => _isLoading = false);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: Color(0xFF0F8A3C),
          content: Text('Identity Verified: Welcome Administrator (bm427251@gmail.com)'),
        ),
      );

      // Grant Access: Navigate to AdminPanelScreen
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (_) => const AdminPanelScreen()),
      );
    });
  }

  void _autofillDemoCredentials() {
    setState(() {
      _emailController.text = _authorizedEmail;
      _passwordController.text = '7788';
      _errorMessage = null;
    });
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FA),
      appBar: AppBar(
        title: const Text('ADMIN AUTHENTICATION'),
        backgroundColor: const Color(0xFF0B1B3D),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const SizedBox(height: 10),

            // Security Header Badge
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.shade200),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 3)),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F8A3C).withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.admin_panel_settings_rounded, color: Color(0xFF0F8A3C), size: 28),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Confidential Control Center',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF0B1B3D)),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Authorized Administrator Email: bm427251@gmail.com',
                          style: TextStyle(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Error banner if any
            if (_errorMessage != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.red.shade200),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.error_outline, color: Colors.red, size: 20),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        _errorMessage!,
                        style: TextStyle(color: Colors.red.shade900, fontSize: 12, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Credentials Card
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
                side: BorderSide(color: Colors.grey.shade200),
              ),
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Admin Email Address', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: InputDecoration(
                        hintText: 'bm427251@gmail.com',
                        prefixIcon: const Icon(Icons.email_outlined, color: Color(0xFFF58220), size: 20),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      ),
                    ),
                    const SizedBox(height: 16),

                    const Text('Security PIN / Password', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 6),
                    TextField(
                      controller: _passwordController,
                      obscureText: _obscurePassword,
                      decoration: InputDecoration(
                        hintText: 'Enter Admin PIN (e.g. 7788)',
                        prefixIcon: const Icon(Icons.lock_outline, color: Color(0xFF0F8A3C), size: 20),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword ? Icons.visibility_off : Icons.visibility,
                            size: 20,
                            color: Colors.grey,
                          ),
                          onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                        ),
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Demo Autofill Helper
            OutlinedButton.icon(
              onPressed: _autofillDemoCredentials,
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                side: BorderSide(color: Colors.orange.shade300),
              ),
              icon: const Icon(Icons.key_rounded, size: 16, color: Color(0xFFF58220)),
              label: const Text(
                'Autofill Admin Credentials (bm427251@gmail.com / 7788)',
                style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFFF58220)),
              ),
            ),
            const SizedBox(height: 16),

            // Login Button
            ElevatedButton(
              onPressed: _isLoading ? null : _handleAdminLogin,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0B1B3D),
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                    )
                  : const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.verified_user, size: 18),
                        SizedBox(width: 8),
                        Text(
                          'Authenticate & Enter Admin Panel',
                          style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ===========================================================================
/// 2. ADMIN PANEL SCREEN (AUTHENTICATED SESSIONS ONLY)
/// ===========================================================================
class AdminPanelScreen extends StatelessWidget {
  const AdminPanelScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('BHARAT MITRA • ADMIN OPS'),
        backgroundColor: const Color(0xFF0B1B3D),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Authenticated Badge
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.green.shade50,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.green.shade300),
              ),
              child: const Row(
                children: [
                  Icon(Icons.verified_user_rounded, color: Color(0xFF0F8A3C), size: 18),
                  SizedBox(width: 8),
                  Text(
                    'Authenticated: Secret Admin Session (3-Tap Verified)',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF0F8A3C),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            const Text(
              'Key Operational Metrics',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // 4 Required Metric Cards
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    'Total Users',
                    '1,48,290',
                    Icons.people_alt_rounded,
                    const Color(0xFF0B1B3D),
                    '+1,240 today',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    'Active Captains',
                    '12,450',
                    Icons.sports_motorsports_rounded,
                    const Color(0xFFF58220),
                    'Online now',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: _buildMetricCard(
                    'Total Rides',
                    '8,92,340',
                    Icons.route_rounded,
                    const Color(0xFF0F8A3C),
                    '99.4% completed',
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildMetricCard(
                    'Total Earnings',
                    '₹4.28 Cr',
                    Icons.currency_rupee_rounded,
                    Colors.purple.shade700,
                    'Commission ₹42.8 L',
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),

            // Visual Earnings Chart (অ্যাডমিন প্যানেলে আর্নিং চার্ট)
            const AdminEarningsChartWidget(),
            const SizedBox(height: 24),

            const Text('Quick Admin Controls', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),

            _buildAdminActionTile(
              context,
              'Captain KYC Approvals (42 Pending)',
              Icons.badge_outlined,
              Colors.orange,
              'Review licenses, vehicle permits & background verification.',
            ),
            _buildAdminActionTile(
              context,
              'SOS Emergency Monitor (0 Active)',
              Icons.emergency_outlined,
              Colors.red,
              'All rides operational. Emergency hotline connected.',
            ),
            _buildAdminActionTile(
              context,
              'Fuel Surcharge & Base Rates',
              Icons.tune_rounded,
              Colors.blue,
              'Adjust district-wise pricing per petrol/diesel rates.',
            ),
            _buildAdminActionTile(
              context,
              'Service Dispatch Toggles',
              Icons.toggle_on_rounded,
              Colors.teal,
              'Enable/disable Bike, Auto, Cab, Parcel in regional clusters.',
            ),
            const SizedBox(height: 16),

            // DYNAMIC LOGO MANAGEMENT SECTION (image_picker & SharedPreferences)
            _buildLogoManagementCard(context),
          ],
        ),
      ),
    );
  }

  static Widget _buildLogoManagementCard(BuildContext context) {
    return AnimatedBuilder(
      animation: LogoManager.instance,
      builder: (context, _) {
        final hasCustom = LogoManager.instance.customLogoPath != null;
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.shade200),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF58220).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Icon(Icons.image_outlined, color: Color(0xFFF58220), size: 22),
                      ),
                      const SizedBox(width: 10),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Dynamic Logo & Branding',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF0B1B3D)),
                          ),
                          Text(
                            'SharedPreferences & image_picker',
                            style: TextStyle(fontSize: 10, color: Colors.grey.shade600),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: hasCustom ? const Color(0xFF0F8A3C).withOpacity(0.12) : Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      hasCustom ? 'Custom Active' : 'Default Emblem',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: hasCustom ? const Color(0xFF0F8A3C) : Colors.grey.shade700,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8F9FA),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Row(
                  children: [
                    const AppLogoWidget(size: 56),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            hasCustom ? 'Uploaded Custom Logo' : 'Official Divine Logo Emblem',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            hasCustom
                                ? 'Path: ${LogoManager.instance.customLogoPath}'
                                : 'Assets: assets/images/logo.png',
                            style: const TextStyle(fontSize: 10, color: Colors.grey),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            '• Instantly updates Splash & App Header\n• Persisted across app restarts',
                            style: TextStyle(fontSize: 10, color: Color(0xFF0F8A3C)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF58220),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () => _pickAndUploadLogo(context),
                      icon: const Icon(Icons.upload_file_rounded, size: 18),
                      label: const Text('Upload New Logo', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  if (hasCustom) ...[
                    const SizedBox(width: 10),
                    OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: Colors.grey.shade700,
                        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () async {
                        await LogoManager.instance.resetToDefault();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Reverted to default Bharat Mitra emblem.')),
                          );
                        }
                      },
                      icon: const Icon(Icons.refresh_rounded, size: 16),
                      label: const Text('Reset', style: TextStyle(fontSize: 12)),
                    ),
                  ],
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  static Future<void> _pickAndUploadLogo(BuildContext context) async {
    try {
      final picker = ImagePicker();
      final XFile? image = await picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (image != null) {
        await LogoManager.instance.updateLogo(image.path);
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              backgroundColor: const Color(0xFF0F8A3C),
              content: Text(
                '✓ Brand Logo Updated: Saved to SharedPreferences (${image.name}). Instantly reflected on Splash and Header.',
              ),
            ),
          );
        }
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Colors.red,
            content: Text('Image Picker Error: $e'),
          ),
        );
      }
    }
  }

  static Widget _buildMetricCard(String title, String value, IconData icon, Color color, String sub) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
              Icon(icon, color: color, size: 20),
            ],
          ),
          const SizedBox(height: 8),
          Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w900)),
          const SizedBox(height: 4),
          Text(sub, style: TextStyle(fontSize: 10, color: color, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  static Widget _buildAdminActionTile(BuildContext context, String title, IconData icon, Color color, String subtitle) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: color.withOpacity(0.12),
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text(subtitle, style: const TextStyle(fontSize: 11)),
        trailing: const Icon(Icons.chevron_right, size: 18),
        onTap: () {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Admin Action: $title triggered')),
          );
        },
      ),
    );
  }
}

/// ===========================================================================
/// 2B. ADMIN EARNINGS CHART & GRAPH WIDGET (অ্যাডমিন প্যানেলে আর্নিং চার্ট)
/// Visual revenue statistics for mobility and rental services
/// ===========================================================================
class AdminEarningsChartWidget extends StatefulWidget {
  const AdminEarningsChartWidget({super.key});

  @override
  State<AdminEarningsChartWidget> createState() => _AdminEarningsChartWidgetState();
}

class _AdminEarningsChartWidgetState extends State<AdminEarningsChartWidget> {
  bool _isWeekly = false;
  bool _isGraphView = false;
  int _selectedIndex = 6; // Sunday default

  final List<Map<String, dynamic>> _dailyData = const [
    {'label': 'Mon', 'transport': 48, 'rental': 22, 'total': 70, 'rides': 1420},
    {'label': 'Tue', 'transport': 56, 'rental': 25, 'total': 81, 'rides': 1650},
    {'label': 'Wed', 'transport': 68, 'rental': 30, 'total': 98, 'rides': 1980},
    {'label': 'Thu', 'transport': 74, 'rental': 34, 'total': 108, 'rides': 2150},
    {'label': 'Fri', 'transport': 92, 'rental': 45, 'total': 137, 'rides': 2840},
    {'label': 'Sat', 'transport': 110, 'rental': 58, 'total': 168, 'rides': 3420},
    {'label': 'Sun', 'transport': 122, 'rental': 65, 'total': 187, 'rides': 3890},
  ];

  final List<Map<String, dynamic>> _weeklyData = const [
    {'label': 'W1', 'transport': 440, 'rental': 140, 'total': 580, 'rides': 11200},
    {'label': 'W2', 'transport': 490, 'rental': 155, 'total': 645, 'rides': 13100},
    {'label': 'W3', 'transport': 530, 'rental': 165, 'total': 695, 'rides': 14800},
    {'label': 'W4', 'transport': 570, 'rental': 179, 'total': 749, 'rides': 17450},
  ];

  List<Map<String, dynamic>> get _currentData => _isWeekly ? _weeklyData : _dailyData;

  @override
  Widget build(BuildContext context) {
    final data = _currentData;
    final int safeIndex = _selectedIndex < data.length ? _selectedIndex : data.length - 1;
    final active = data[safeIndex];
    final double maxRevenue = data.map((e) => (e['total'] as int).toDouble()).reduce((a, b) => a > b ? a : b);

    return Card(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header with Bengali badge & View toggles
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.purple.shade50,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    _isGraphView ? Icons.show_chart_rounded : Icons.bar_chart_rounded,
                    color: Colors.purple.shade700,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Text(
                            _isGraphView ? 'Earnings Trend Graph' : 'Revenue Bar Chart',
                            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.purple.shade50,
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: Colors.purple.shade200),
                            ),
                            child: const Text(
                              'আর্নিং চার্ট',
                              style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Colors.purple),
                            ),
                          ),
                        ],
                      ),
                      Text(
                        _isWeekly ? 'Weekly trajectory (Month W1 - W4)' : 'Daily breakdown (Mon - Sun)',
                        style: const TextStyle(fontSize: 11, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Controls: Daily vs Weekly & Bars vs Graph
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      _buildPillTab(
                        'Daily (7D)',
                        !_isWeekly,
                        () => setState(() {
                          _isWeekly = false;
                          _selectedIndex = 6;
                        }),
                      ),
                      _buildPillTab(
                        'Weekly (4W)',
                        _isWeekly,
                        () => setState(() {
                          _isWeekly = true;
                          _selectedIndex = 3;
                        }),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(3),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      _buildPillTab(
                        'Bars',
                        !_isGraphView,
                        () => setState(() => _isGraphView = false),
                        icon: Icons.bar_chart,
                      ),
                      _buildPillTab(
                        'Graph',
                        _isGraphView,
                        () => setState(() => _isGraphView = true),
                        icon: Icons.show_chart,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),

            // Summary stats chips
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFFF8F9FA),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(_isWeekly ? 'Monthly Gross' : 'Weekly Gross', style: const TextStyle(fontSize: 10, color: Colors.grey)),
                      Text(
                        _isWeekly ? '₹26,69,000' : '₹7,49,000',
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF0B1B3D)),
                      ),
                      const Text('+18.4% growth', style: TextStyle(fontSize: 9, color: Color(0xFF0F8A3C), fontWeight: FontWeight.bold)),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Transport (76%)', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      Text(
                        _isWeekly ? '₹20,30,000' : '₹5,70,000',
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFFF58220)),
                      ),
                      const Text('Bike/Auto/Cab', style: TextStyle(fontSize: 9, color: Colors.grey)),
                    ],
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Rentals (24%)', style: TextStyle(fontSize: 10, color: Colors.grey)),
                      Text(
                        _isWeekly ? '₹6,39,000' : '₹1,79,000',
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF0F8A3C)),
                      ),
                      const Text('Car & Driver', style: TextStyle(fontSize: 9, color: Colors.grey)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),

            // Legend
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                _buildLegendItem(const Color(0xFFF58220), 'Transport'),
                const SizedBox(width: 12),
                _buildLegendItem(const Color(0xFF0F8A3C), 'Rentals'),
                if (_isGraphView) ...[
                  const SizedBox(width: 12),
                  _buildLegendItem(const Color(0xFFC084FC), 'Total'),
                ],
              ],
            ),
            const SizedBox(height: 8),

            // Visual Rendering: Stacked Bar Chart OR Trend Graph
            if (!_isGraphView)
              SizedBox(
                height: 140,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: data.asMap().entries.map((entry) {
                    final idx = entry.key;
                    final item = entry.value;
                    final isSelected = idx == safeIndex;
                    final double totalHeight = ((item['total'] as int) / maxRevenue) * 90;
                    final double transRatio = (item['transport'] as int) / (item['total'] as int);

                    return Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedIndex = idx),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            Text(
                              '₹${item['total']}k',
                              style: TextStyle(
                                fontSize: 9,
                                fontWeight: isSelected ? FontWeight.w900 : FontWeight.w500,
                                color: isSelected ? const Color(0xFF0B1B3D) : Colors.grey.shade600,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Container(
                              width: _isWeekly ? 38 : 28,
                              height: totalHeight,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(6),
                                border: isSelected
                                    ? Border.all(color: Colors.purple.shade700, width: 2)
                                    : null,
                              ),
                              clipBehavior: Clip.antiAlias,
                              child: Column(
                                children: [
                                  Expanded(
                                    flex: ((1.0 - transRatio) * 100).round(),
                                    child: Container(color: const Color(0xFF0F8A3C)),
                                  ),
                                  Expanded(
                                    flex: (transRatio * 100).round(),
                                    child: Container(color: const Color(0xFFF58220)),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              item['label'] as String,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: isSelected ? FontWeight.w900 : FontWeight.normal,
                                color: isSelected ? Colors.purple.shade700 : Colors.black87,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
              )
            else
              Container(
                height: 150,
                decoration: BoxDecoration(
                  color: const Color(0xFF0F172A),
                  borderRadius: BorderRadius.circular(12),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                child: GestureDetector(
                  onTapDown: (details) {
                    final width = context.size?.width ?? 300;
                    final tapRatio = details.localPosition.dx / width;
                    final target = (tapRatio * data.length).floor().clamp(0, data.length - 1);
                    setState(() => _selectedIndex = target);
                  },
                  child: CustomPaint(
                    painter: _EarningsGraphPainter(
                      data: data,
                      selectedIndex: safeIndex,
                      maxRevenue: maxRevenue,
                    ),
                    size: Size.infinite,
                  ),
                ),
              ),

            const SizedBox(height: 12),

            // Selected day/week drilldown card
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.purple.shade50.withOpacity(0.6),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: Colors.purple.shade100),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${active['label']}: Total ₹${(active['total'] as int) * 1000}',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Colors.purple.shade900),
                  ),
                  Text(
                    'Mobility ₹${(active['transport'] as int) * 1000} • Rentals ₹${(active['rental'] as int) * 1000}',
                    style: const TextStyle(fontSize: 11, color: Colors.black87, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPillTab(String text, bool active, VoidCallback onTap, {IconData? icon}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: active ? Colors.white : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
          boxShadow: active ? [const BoxShadow(color: Colors.black12, blurRadius: 2)] : null,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null) ...[
              Icon(icon, size: 12, color: active ? Colors.purple.shade700 : Colors.grey),
              const SizedBox(width: 3),
            ],
            Text(
              text,
              style: TextStyle(
                fontSize: 11,
                fontWeight: active ? FontWeight.bold : FontWeight.normal,
                color: active ? Colors.purple.shade700 : Colors.grey.shade700,
              ),
            ),
          ],
        ),
      ),
    );
  }

  static Widget _buildLegendItem(Color color, String text) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(3)),
        ),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(fontSize: 10, color: Colors.black54)),
      ],
    );
  }
}

/// Custom Painter for Earnings Trend Graph
class _EarningsGraphPainter extends CustomPainter {
  final List<Map<String, dynamic>> data;
  final int selectedIndex;
  final double maxRevenue;

  _EarningsGraphPainter({
    required this.data,
    required this.selectedIndex,
    required this.maxRevenue,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final gridPaint = Paint()
      ..color = const Color(0xFF334155)
      ..strokeWidth = 0.8;

    canvas.drawLine(const Offset(20, 20), Offset(size.width - 20, 20), gridPaint);
    canvas.drawLine(Offset(20, size.height * 0.5), Offset(size.width - 20, size.height * 0.5), gridPaint);
    canvas.drawLine(Offset(20, size.height - 25), Offset(size.width - 20, size.height - 25), gridPaint);

    final n = data.length;
    final usableW = size.width - 60;
    final usableH = size.height - 45;

    final totalPoints = <Offset>[];
    final transportPoints = <Offset>[];
    final rentalPoints = <Offset>[];

    for (int i = 0; i < n; i++) {
      final x = 30 + (i / (n - 1)) * usableW;
      final total = (data[i]['total'] as int).toDouble();
      final trans = (data[i]['transport'] as int).toDouble();
      final rent = (data[i]['rental'] as int).toDouble();

      final yTotal = (size.height - 25) - (total / maxRevenue) * usableH;
      final yTrans = (size.height - 25) - (trans / maxRevenue) * usableH;
      final yRent = (size.height - 25) - (rent / maxRevenue) * usableH;

      totalPoints.add(Offset(x, yTotal));
      transportPoints.add(Offset(x, yTrans));
      rentalPoints.add(Offset(x, yRent));
    }

    // Draw area under total curve
    final areaPath = Path()..moveTo(totalPoints[0].dx, totalPoints[0].dy);
    for (int i = 1; i < n; i++) {
      final prev = totalPoints[i - 1];
      final curr = totalPoints[i];
      final cX = (prev.dx + curr.dx) / 2;
      areaPath.cubicTo(cX, prev.dy, cX, curr.dy, curr.dx, curr.dy);
    }
    areaPath.lineTo(totalPoints.last.dx, size.height - 25);
    areaPath.lineTo(totalPoints.first.dx, size.height - 25);
    areaPath.close();

    final fillPaint = Paint()
      ..shader = const LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [Color(0x66A855F7), Color(0x00A855F7)],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawPath(areaPath, fillPaint);

    // Draw Transport Curve (Saffron)
    _drawSmoothCurve(canvas, transportPoints, const Color(0xFFF58220), 2.0);

    // Draw Rental Curve (Green)
    _drawSmoothCurve(canvas, rentalPoints, const Color(0xFF0F8A3C), 2.0);

    // Draw Total Curve (Purple/Gold)
    _drawSmoothCurve(canvas, totalPoints, const Color(0xFFC084FC), 3.0);

    // Draw points and labels
    for (int i = 0; i < n; i++) {
      final pt = totalPoints[i];
      final isSel = i == selectedIndex;

      if (isSel) {
        canvas.drawCircle(pt, 10, Paint()..color = const Color(0x66A855F7));
      }

      canvas.drawCircle(pt, isSel ? 5.5 : 3.5, Paint()..color = isSel ? const Color(0xFFFDE047) : Colors.white);
      canvas.drawCircle(pt, isSel ? 5.5 : 3.5, Paint()..color = const Color(0xFF0F172A)..style = PaintingStyle.stroke..strokeWidth = 1.5);

      final textPainter = TextPainter(
        text: TextSpan(
          text: data[i]['label'] as String,
          style: TextStyle(
            color: isSel ? const Color(0xFFC084FC) : const Color(0xFF94A3B8),
            fontSize: isSel ? 10 : 9,
            fontWeight: isSel ? FontWeight.bold : FontWeight.normal,
          ),
        ),
        textDirection: TextDirection.ltr,
      )..layout();
      textPainter.paint(canvas, Offset(pt.dx - textPainter.width / 2, size.height - 18));
    }
  }

  void _drawSmoothCurve(Canvas canvas, List<Offset> points, Color color, double width) {
    if (points.isEmpty) return;
    final path = Path()..moveTo(points[0].dx, points[0].dy);
    for (int i = 1; i < points.length; i++) {
      final prev = points[i - 1];
      final curr = points[i];
      final cX = (prev.dx + curr.dx) / 2;
      path.cubicTo(cX, prev.dy, cX, curr.dy, curr.dx, curr.dy);
    }
    final paint = Paint()
      ..color = color
      ..strokeWidth = width
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _EarningsGraphPainter oldDelegate) {
    return oldDelegate.selectedIndex != selectedIndex || oldDelegate.data != data;
  }
}

/// ===========================================================================
/// 3. SERVICE SCREEN 1: BIKE TAXI
/// ===========================================================================
class BikeTaxiScreen extends StatefulWidget {
  const BikeTaxiScreen({super.key});

  @override
  State<BikeTaxiScreen> createState() => _BikeTaxiScreenState();
}

class _BikeTaxiScreenState extends State<BikeTaxiScreen> {
  final _pickupController = TextEditingController(text: 'Railway Station Gate 1');
  final _dropController = TextEditingController(text: 'Gandhi Market Square');
  bool _helmetRequired = true;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bike Taxi • Fast & Affordable')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildRouteCard(_pickupController, _dropController),
            const SizedBox(height: 16),
            Card(
              child: SwitchListTile(
                value: _helmetRequired,
                onChanged: (val) => setState(() => _helmetRequired = val),
                title: const Text('Rider Helmet Provided', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                subtitle: const Text('Safety sanitized helmet included for free.', style: TextStyle(fontSize: 11)),
                secondary: const Icon(Icons.sports_motorsports_rounded, color: Color(0xFFF58220)),
              ),
            ),
            const SizedBox(height: 16),
            _buildFareSummary('₹35', 'Estimated time: 11 mins • 3.4 km'),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _confirmBooking(context, 'Bike Taxi', '₹35'),
                child: const Text('Book Bike Mitra (₹35)'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ===========================================================================
/// 4. SERVICE SCREEN 2: AUTO-RICKSHAW
/// ===========================================================================
class AutoRickshawScreen extends StatefulWidget {
  const AutoRickshawScreen({super.key});

  @override
  State<AutoRickshawScreen> createState() => _AutoRickshawScreenState();
}

class _AutoRickshawScreenState extends State<AutoRickshawScreen> {
  final _pickupController = TextEditingController(text: 'Bus Stand Road');
  final _dropController = TextEditingController(text: 'District Civil Hospital');
  bool _useMeter = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Auto-Rickshaw • Local Mitra')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildRouteCard(_pickupController, _dropController),
            const SizedBox(height: 16),
            Card(
              child: RadioListTile<bool>(
                value: false,
                groupValue: _useMeter,
                onChanged: (val) => setState(() => _useMeter = val!),
                title: const Text('Guaranteed Fixed Fare (₹55)'),
                subtitle: const Text('No bargaining, locked upfront price'),
              ),
            ),
            Card(
              child: RadioListTile<bool>(
                value: true,
                groupValue: _useMeter,
                onChanged: (val) => setState(() => _useMeter = val!),
                title: const Text('Government Digital Meter Fare'),
                subtitle: const Text('Pay per km as approved by Regional Transport Authority'),
              ),
            ),
            const SizedBox(height: 16),
            _buildFareSummary(_useMeter ? 'Meter Rate' : '₹55', '3 Passengers allowed • Zero surge'),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F8A3C)),
                onPressed: () => _confirmBooking(context, 'Auto-Rickshaw', _useMeter ? 'Govt Meter' : '₹55'),
                child: const Text('Confirm Auto-Rickshaw'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ===========================================================================
/// 5. SERVICE SCREEN 3: CAB / RIDE
/// ===========================================================================
class CabRideScreen extends StatefulWidget {
  const CabRideScreen({super.key});

  @override
  State<CabRideScreen> createState() => _CabRideScreenState();
}

class _CabRideScreenState extends State<CabRideScreen> {
  final _pickupController = TextEditingController(text: 'Main Mandi Hub');
  final _dropController = TextEditingController(text: 'Airport / Expressway Jn');
  int _selectedCabType = 0;

  final cabs = [
    {'name': 'Mini / Hatchback', 'desc': 'WagonR, Tiago • 4 Seats AC', 'fare': '₹140'},
    {'name': 'Prime Sedan', 'desc': 'Dzire, Etios • Extra boot space', 'fare': '₹190'},
    {'name': 'Rural SUV Plus', 'desc': 'Bolero, Ertiga • High clearance', 'fare': '₹280'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Cab & Rides • 4 Wheeler')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildRouteCard(_pickupController, _dropController),
            const SizedBox(height: 16),
            ...List.generate(cabs.length, (idx) {
              final cab = cabs[idx];
              final isSel = _selectedCabType == idx;
              return Card(
                color: isSel ? const Color(0xFFF58220).withOpacity(0.08) : Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(
                    color: isSel ? const Color(0xFFF58220) : Colors.grey.shade200,
                    width: isSel ? 2 : 1,
                  ),
                ),
                child: ListTile(
                  leading: const Icon(Icons.directions_car_filled_rounded, color: Color(0xFF0B1B3D)),
                  title: Text(cab['name']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  subtitle: Text(cab['desc']!, style: const TextStyle(fontSize: 11)),
                  trailing: Text(cab['fare']!, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 15)),
                  onTap: () => setState(() => _selectedCabType = idx),
                ),
              );
            }),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _confirmBooking(context, cabs[_selectedCabType]['name']!, cabs[_selectedCabType]['fare']!),
                child: Text('Book ${cabs[_selectedCabType]["name"]} (${cabs[_selectedCabType]["fare"]})'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ===========================================================================
/// 6. SERVICE SCREEN 4: PARCEL DELIVERY
/// ===========================================================================
class ParcelDeliveryScreen extends StatefulWidget {
  const ParcelDeliveryScreen({super.key});

  @override
  State<ParcelDeliveryScreen> createState() => _ParcelDeliveryScreenState();
}

class _ParcelDeliveryScreenState extends State<ParcelDeliveryScreen> {
  final _senderController = TextEditingController(text: 'Shop 14, Cloth Market');
  final _receiverController = TextEditingController(text: 'House 82, Sector 4');
  String _packageType = 'Documents & Files';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Parcel Delivery • Instant Dispatch')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildRouteCard(_senderController, _receiverController, pickLabel: 'Pickup Sender', dropLabel: 'Delivery Receiver'),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Package Contents', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: _packageType,
                      decoration: const InputDecoration(border: OutlineInputBorder()),
                      items: const [
                        DropdownMenuItem(value: 'Documents & Files', child: Text('Documents & Files (Under 1kg)')),
                        DropdownMenuItem(value: 'Food & Sweets', child: Text('Food, Tiffin & Sweets')),
                        DropdownMenuItem(value: 'Electronics & Medicines', child: Text('Electronics & Medicines')),
                        DropdownMenuItem(value: 'Box / Heavy Items (up to 15kg)', child: Text('Box (up to 15kg)')),
                      ],
                      onChanged: (val) => setState(() => _packageType = val!),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            _buildFareSummary('₹45', 'Delivery OTP verification enabled • Insurance up to ₹5,000'),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _confirmBooking(context, 'Parcel ($_packageType)', '₹45'),
                child: const Text('Send Parcel (₹45)'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ===========================================================================
/// 7. SERVICE SCREEN 5: RENT A CAR (WITH DRIVER vs SELF-DRIVE TOGGLE)
/// ===========================================================================
class RentCarScreen extends StatefulWidget {
  const RentCarScreen({super.key});

  @override
  State<RentCarScreen> createState() => _RentCarScreenState();
}

class _RentCarScreenState extends State<RentCarScreen> {
  bool _withDriver = true; // true = With Driver (ড্রাইভার সহ), false = Self-Drive (সেলফ ড্রাইভ)
  DateTime _startDate = DateTime.now().add(const Duration(days: 1));
  DateTime _endDate = DateTime.now().add(const Duration(days: 3));
  int _selectedVehicle = 0;

  final rentalCars = [
    {
      'name': 'Mahindra Bolero Neo',
      'owner': 'Ramlal Yadav (Rampur Village)',
      'rate': '₹1,500/day',
      'badge': 'High Ground Clearance • Rural Tough',
    },
    {
      'name': 'Maruti Suzuki Swift',
      'owner': 'Vikram Meena (City Center)',
      'rate': '₹1,200/day',
      'badge': '22 km/l Mileage • Economical',
    },
    {
      'name': 'Mahindra Scorpio-N',
      'owner': 'Baljit Singh (Panchayat verified)',
      'rate': '₹2,400/day',
      'badge': '7-Seater • Highway & Village Roads',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final modeLabel = _withDriver ? 'With Driver (ড্রাইভার সহ)' : 'Self-Drive (সেলফ ড্রাইভ)';
    return Scaffold(
      appBar: AppBar(title: const Text('Rent a Car • Local Owner Fleet')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drive Option Toggle
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Rental Option / ড্রাইভিং মোড',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () => setState(() => _withDriver = true),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                              decoration: BoxDecoration(
                                color: _withDriver ? const Color(0xFF0F8A3C).withOpacity(0.12) : Colors.grey.shade50,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: _withDriver ? const Color(0xFF0F8A3C) : Colors.grey.shade300,
                                  width: _withDriver ? 2 : 1,
                                ),
                              ),
                              child: Column(
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.person_pin_rounded,
                                        size: 16,
                                        color: _withDriver ? const Color(0xFF0F8A3C) : Colors.grey,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'With Driver',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: _withDriver ? const Color(0xFF0F8A3C) : Colors.black87,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  const Text(
                                    '(ড্রাইভার সহ)',
                                    style: TextStyle(fontSize: 10, color: Colors.grey),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: InkWell(
                            onTap: () => setState(() => _withDriver = false),
                            borderRadius: BorderRadius.circular(12),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
                              decoration: BoxDecoration(
                                color: !_withDriver ? const Color(0xFF0F8A3C).withOpacity(0.12) : Colors.grey.shade50,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: !_withDriver ? const Color(0xFF0F8A3C) : Colors.grey.shade300,
                                  width: !_withDriver ? 2 : 1,
                                ),
                              ),
                              child: Column(
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.directions_car_rounded,
                                        size: 16,
                                        color: !_withDriver ? const Color(0xFF0F8A3C) : Colors.grey,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Self-Drive',
                                        style: TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 12,
                                          color: !_withDriver ? const Color(0xFF0F8A3C) : Colors.black87,
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 2),
                                  const Text(
                                    '(সেলফ ড্রাইভ)',
                                    style: TextStyle(fontSize: 10, color: Colors.grey),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _withDriver
                          ? '✓ Verified commercial driver included • Stress-free rural travel (+₹400/day)'
                          : '✓ Valid Driving License & Aadhaar KYC required • Drive yourself',
                      style: TextStyle(fontSize: 11, color: Colors.grey.shade700),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),

            // Date & Time Selectors
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Rental Period & Schedule', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            icon: const Icon(Icons.calendar_today_rounded, size: 16),
                            label: Text('From: ${_startDate.day}/${_startDate.month}'),
                            onPressed: () async {
                              final d = await showDatePicker(
                                context: context,
                                initialDate: _startDate,
                                firstDate: DateTime.now(),
                                lastDate: DateTime.now().add(const Duration(days: 90)),
                              );
                              if (d != null) setState(() => _startDate = d);
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: OutlinedButton.icon(
                            icon: const Icon(Icons.event_available_rounded, size: 16),
                            label: Text('To: ${_endDate.day}/${_endDate.month}'),
                            onPressed: () async {
                              final d = await showDatePicker(
                                context: context,
                                initialDate: _endDate,
                                firstDate: _startDate,
                                lastDate: DateTime.now().add(const Duration(days: 90)),
                              );
                              if (d != null) setState(() => _endDate = d);
                            },
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Available Local Owner Vehicles', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            ...List.generate(rentalCars.length, (idx) {
              final car = rentalCars[idx];
              final isSel = _selectedVehicle == idx;
              return Card(
                color: isSel ? const Color(0xFF0F8A3C).withOpacity(0.06) : Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(
                    color: isSel ? const Color(0xFF0F8A3C) : Colors.grey.shade200,
                    width: isSel ? 2 : 1,
                  ),
                ),
                child: ListTile(
                  leading: const Icon(Icons.car_rental_rounded, color: Color(0xFF0F8A3C), size: 28),
                  title: Text(car['name']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Owner: ${car['owner']}', style: const TextStyle(fontSize: 11)),
                      Text(car['badge']!, style: const TextStyle(fontSize: 10, color: Colors.blueGrey)),
                    ],
                  ),
                  trailing: Text(car['rate']!, style: const TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0F8A3C))),
                  onTap: () => setState(() => _selectedVehicle = idx),
                ),
              );
            }),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0F8A3C)),
                onPressed: () => _confirmBooking(
                  context,
                  '${rentalCars[_selectedVehicle]["name"]} • $modeLabel',
                  rentalCars[_selectedVehicle]['rate']!,
                ),
                child: Text('Reserve ${rentalCars[_selectedVehicle]["name"]} ($modeLabel)'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ===========================================================================
/// 8. SERVICE SCREEN 6: HIRE A DRIVER
/// ===========================================================================
class HireDriverScreen extends StatefulWidget {
  const HireDriverScreen({super.key});

  @override
  State<HireDriverScreen> createState() => _HireDriverScreenState();
}

class _HireDriverScreenState extends State<HireDriverScreen> {
  int _hours = 4;
  String _carGearType = 'Manual Transmission';
  String _tripScope = 'Local City / Village Runs';

  @override
  Widget build(BuildContext context) {
    final fare = 150 + (_hours * 79);
    return Scaffold(
      appBar: AppBar(title: const Text('Hire a Driver • On-Demand Chauffeur')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Vehicle Transmission', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<String>(
                      value: _carGearType,
                      decoration: const InputDecoration(border: OutlineInputBorder()),
                      items: const [
                        DropdownMenuItem(value: 'Manual Transmission', child: Text('Manual (Stick shift)')),
                        DropdownMenuItem(value: 'Automatic Transmission', child: Text('Automatic (AT / CVT / DCT)')),
                      ],
                      onChanged: (val) => setState(() => _carGearType = val!),
                    ),
                    const SizedBox(height: 14),
                    Text('Duration Needed: $_hours Hours', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    Slider(
                      value: _hours.toDouble(),
                      min: 2,
                      max: 12,
                      divisions: 10,
                      label: '$_hours hrs',
                      activeColor: const Color(0xFFF58220),
                      onChanged: (val) => setState(() => _hours = val.toInt()),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Trip Type', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                    RadioListTile<String>(
                      value: 'Local City / Village Runs',
                      groupValue: _tripScope,
                      onChanged: (v) => setState(() => _tripScope = v!),
                      title: const Text('Local Commute / Shopping / Medical'),
                    ),
                    RadioListTile<String>(
                      value: 'Outstation Highway Trip',
                      groupValue: _tripScope,
                      onChanged: (v) => setState(() => _tripScope = v!),
                      title: const Text('Outstation Highway (State Permit Ready)'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            _buildFareSummary('₹$fare', 'Police verified driver with commercial DL rating 4.8★+'),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () => _confirmBooking(context, 'Chauffeur for $_hours hrs', '₹$fare'),
                child: Text('Book Verified Driver (₹$fare)'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ===========================================================================
/// REUSABLE HELPER UI FUNCTIONS
/// ===========================================================================
Widget _buildRouteCard(
  TextEditingController pickCtrl,
  TextEditingController dropCtrl, {
  String pickLabel = 'Pickup Location',
  String dropLabel = 'Destination Dropoff',
}) {
  return Card(
    child: Padding(
      padding: const EdgeInsets.all(14),
      child: Column(
        children: [
          TextField(
            controller: pickCtrl,
            decoration: InputDecoration(
              labelText: pickLabel,
              prefixIcon: const Icon(Icons.circle, color: Color(0xFF0F8A3C), size: 14),
              border: const UnderlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: dropCtrl,
            decoration: InputDecoration(
              labelText: dropLabel,
              prefixIcon: const Icon(Icons.location_on_rounded, color: Color(0xFFF58220), size: 18),
              border: InputBorder.none,
            ),
          ),
        ],
      ),
    ),
  );
}

Widget _buildFareSummary(String fare, String subtitle) {
  return Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(12),
      border: Border.all(color: Colors.grey.shade200),
    ),
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Total Estimated Fare', style: TextStyle(fontSize: 11, color: Colors.grey)),
            Text(fare, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0B1B3D))),
          ],
        ),
        Text(subtitle, style: const TextStyle(fontSize: 11, color: Colors.grey, fontWeight: FontWeight.w600)),
      ],
    ),
  );
}

void _confirmBooking(BuildContext context, String service, String fare) {
  showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: SafeArea(
        top: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
              ),
            ),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0B1B3D),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.account_balance_wallet_rounded, color: Color(0xFFF58220), size: 24),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Razorpay Secure Payment', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('$service • Fare: $fare', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                    ],
                  ),
                ),
                Text(
                  fare,
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Color(0xFF0B1B3D)),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Official Razorpay Gateway Handle Info
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFF86EFAC)),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.verified, color: Color(0xFF0F8A3C), size: 16),
                      SizedBox(width: 6),
                      Text(
                        'Official Razorpay Payment Gateway',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: Color(0xFF0F8A3C)),
                      ),
                    ],
                  ),
                  SizedBox(height: 6),
                  SelectableText(
                    'https://razorpay.me/@bharatmitrainfotech',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF0B1B3D), fontFamily: 'monospace'),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Merchant Settlement & Notification Email: bm427251@gmail.com',
                    style: TextStyle(fontSize: 10, color: Colors.black54),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Instant Razorpay Payment Action
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFF58220),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.of(ctx).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    backgroundColor: Color(0xFF0F8A3C),
                    content: Text('Payment gateway opened (@bharatmitrainfotech). Transaction receipt sent to bm427251@gmail.com.'),
                  ),
                );
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (_) => LiveTrackingScreen(
                      serviceName: service,
                      fare: fare,
                    ),
                  ),
                );
              },
              icon: const Icon(Icons.bolt, size: 20),
              label: const Text('Pay via Razorpay UPI / Gateway (Instant)', style: TextStyle(fontWeight: FontWeight.bold)),
            ),
            const SizedBox(height: 10),

            // Cash on Delivery Option
            OutlinedButton.icon(
              style: OutlinedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: () {
                Navigator.of(ctx).pop();
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (_) => LiveTrackingScreen(
                      serviceName: service,
                      fare: fare,
                    ),
                  ),
                );
              },
              icon: const Icon(Icons.money, size: 20),
              label: const Text('Pay Cash to Captain upon Arrival'),
            ),
          ],
        ),
      ),
    ),
  );
}

/// ===========================================================================
/// 8. LIVE RIDE TRACKING SCREEN (রিয়েল-টাইম রাইড ট্র্যাকিং)
/// Interactive simulated map with animated route line and driver marker
/// ===========================================================================
class LiveTrackingScreen extends StatefulWidget {
  final String serviceName;
  final String fare;
  final String pickup;
  final String dropoff;

  const LiveTrackingScreen({
    super.key,
    required this.serviceName,
    required this.fare,
    this.pickup = 'Current Location (Pickup Pin)',
    this.dropoff = 'Destination Dropoff Point',
  });

  @override
  State<LiveTrackingScreen> createState() => _LiveTrackingScreenState();
}

class _LiveTrackingScreenState extends State<LiveTrackingScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;
  int _etaMinutes = 3;
  bool _sosAlerted = false;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 8),
    )..addListener(() {
        final val = _animController.value;
        if (val > 0.7 && _etaMinutes != 1) {
          setState(() => _etaMinutes = 1);
        } else if (val > 0.4 && _etaMinutes != 2) {
          setState(() => _etaMinutes = 2);
        }
      })
      ..repeat();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _showCancelRideDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Row(
          children: [
            Icon(Icons.cancel_outlined, color: Colors.red, size: 26),
            SizedBox(width: 8),
            Text('Cancel Ride?', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
          ],
        ),
        content: const Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Are you sure you want to cancel this ongoing trip?\n(আপনি কি রাইডটি বাতিল করতে চান?)',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
            ),
            SizedBox(height: 10),
            Text(
              '• Trip simulation stops immediately.\n• Zero cancellation penalty fee applied.\n• You will be returned to Home Screen.',
              style: TextStyle(fontSize: 12, color: Colors.black54),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Keep Ride'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              Navigator.of(ctx).pop(); // Dismiss dialog
              _animController.stop(); // Stop simulation
              _showRatingModal(isCancelled: true);
            },
            child: const Text('Confirm Cancel'),
          ),
        ],
      ),
    );
  }

  void _showRatingModal({required bool isCancelled}) {
    int selectedStars = isCancelled ? 3 : 5;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => Container(
          padding: const EdgeInsets.all(22),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: SafeArea(
            top: false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    margin: const EdgeInsets.only(bottom: 16),
                    decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                  ),
                ),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isCancelled ? Colors.red.shade50 : const Color(0xFFF58220).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        isCancelled ? Icons.rate_review_rounded : Icons.star_rounded,
                        color: isCancelled ? Colors.red : const Color(0xFFF58220),
                        size: 26,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isCancelled ? 'Trip Feedback • রাইড মতামত' : 'Rate Your Trip • রেটিং দিন',
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF0B1B3D)),
                          ),
                          Text(
                            '${widget.serviceName} • Captain Ramesh Kumar',
                            style: const TextStyle(fontSize: 12, color: Colors.grey),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Center(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(5, (index) {
                      final star = index + 1;
                      return IconButton(
                        iconSize: 38,
                        icon: Icon(
                          star <= selectedStars ? Icons.star_rounded : Icons.star_outline_rounded,
                          color: const Color(0xFFF58220),
                        ),
                        onPressed: () => setModalState(() => selectedStars = star),
                      );
                    }),
                  ),
                ),
                Center(
                  child: Text(
                    selectedStars == 5
                        ? '⭐⭐⭐⭐⭐ Outstanding (অসামান্য)'
                        : selectedStars >= 3
                            ? 'Good Service (ভালো)'
                            : 'Needs Improvement (উন্নতি প্রয়োজন)',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF0B1B3D)),
                  ),
                ),
                const SizedBox(height: 14),
                // Textual Feedback Input for Driver
                TextField(
                  maxLines: 2,
                  decoration: InputDecoration(
                    hintText: isCancelled 
                        ? 'Tell us why you cancelled or give feedback for captain...' 
                        : 'Share your appreciation or feedback for Captain Ramesh Kumar...',
                    hintStyle: const TextStyle(fontSize: 12, color: Colors.grey),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(color: Colors.grey.shade300),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: Color(0xFFF58220)),
                    ),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                ),
                const SizedBox(height: 16),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFF58220),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  onPressed: () {
                    Navigator.of(ctx).pop(); // dismiss modal
                    Navigator.of(context).pop(); // return to home
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: const Color(0xFF0F8A3C),
                        content: Text('Feedback Submitted ($selectedStars ★)! Thank you for using Bharat Mitra.'),
                      ),
                    );
                  },
                  child: const Text('Submit Rating & Return to Home', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    Navigator.of(context).pop();
                  },
                  child: const Text('Skip & Return to Home', style: TextStyle(color: Colors.grey)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      appBar: AppBar(
        backgroundColor: const Color(0xFF0B1B3D),
        elevation: 0,
        title: Column(
          children: [
            const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.fiber_manual_record, color: Color(0xFF0F8A3C), size: 12),
                SizedBox(width: 6),
                Text('LIVE RIDE TRACKING', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, letterSpacing: 0.8)),
              ],
            ),
            Text(
              'রিয়েল-টাইম ট্র্যাকিং • ${widget.serviceName}',
              style: const TextStyle(fontSize: 10, color: Colors.white70),
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Reset Live Simulation',
            onPressed: () => _animController.forward(from: 0.0),
          ),
        ],
      ),
      body: Column(
        children: [
          // Simulated Interactive Map Canvas
          Expanded(
            flex: 6,
            child: Stack(
              children: [
                // Animated Custom Route & Driver Painter
                AnimatedBuilder(
                  animation: _animController,
                  builder: (context, _) {
                    return CustomPaint(
                      painter: _MapRoutePainter(_animController.value),
                      size: Size.infinite,
                    );
                  },
                ),

                // Floating ETA Banner at top of map
                Positioned(
                  top: 14,
                  left: 16,
                  right: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0B1B3D).withOpacity(0.92),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFF58220).withOpacity(0.4)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.3),
                          blurRadius: 10,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(6),
                              decoration: BoxDecoration(
                                color: const Color(0xFF0F8A3C).withOpacity(0.2),
                                shape: BoxShape.circle,
                              ),
                              child: const Icon(Icons.navigation_rounded, color: Color(0xFF0F8A3C), size: 18),
                            ),
                            const SizedBox(width: 10),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Captain Arriving in ~$_etaMinutes mins',
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                                ),
                                const Text(
                                  'Driver moving towards pickup point',
                                  style: TextStyle(color: Colors.white60, fontSize: 11),
                                ),
                              ],
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF58220),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            widget.fare,
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 13),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Floating SOS Button
                Positioned(
                  bottom: 14,
                  right: 16,
                  child: FloatingActionButton.small(
                    backgroundColor: _sosAlerted ? Colors.red.shade700 : const Color(0xFFDC2626),
                    onPressed: () {
                      setState(() => _sosAlerted = !_sosAlerted);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          backgroundColor: Colors.red.shade900,
                          content: Text(_sosAlerted
                              ? '🚨 24/7 Police SOS Triggered! GPS sent to local police control.'
                              : 'SOS Standby.'),
                        ),
                      );
                    },
                    child: const Icon(Icons.emergency, color: Colors.white),
                  ),
                ),
              ],
            ),
          ),

          // Bottom Captain Details Sheet
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              boxShadow: [
                BoxShadow(color: Colors.black26, blurRadius: 10, offset: Offset(0, -2)),
              ],
            ),
            child: SafeArea(
              top: false,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Drag indicator
                  Container(
                    width: 36,
                    height: 4,
                    margin: const EdgeInsets.only(bottom: 12),
                    decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
                  ),

                  // Captain profile and OTP
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: const Color(0xFF0B1B3D),
                        child: const Text('RK', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Row(
                              children: [
                                Text('Ramesh Kumar', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                                SizedBox(width: 6),
                                Icon(Icons.star_rounded, color: Colors.amber, size: 16),
                                Text('4.9', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                              ],
                            ),
                            Text(
                              'Verified Bharat Mitra Captain • DL-01-BK-9182',
                              style: TextStyle(fontSize: 11, color: Colors.grey.shade700),
                            ),
                          ],
                        ),
                      ),

                      // Large Trip Start OTP Box
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF8F9FA),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: const Column(
                          children: [
                            Text('TRIP OTP', style: TextStyle(fontSize: 9, fontWeight: FontWeight.bold, color: Colors.grey)),
                            Text('8492', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF0B1B3D), letterSpacing: 1.5)),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),

                  // Route locations preview
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8F9FA),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.circle, color: Color(0xFF0F8A3C), size: 10),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                widget.pickup,
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 10),
                        Row(
                          children: [
                            const Icon(Icons.location_on, color: Color(0xFFF58220), size: 12),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                widget.dropoff,
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),

                  // Action Buttons: Call Captain + Cancel Ride + Back
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Calling Captain Ramesh Kumar (+91 98765-43210)...')),
                            );
                          },
                          icon: const Icon(Icons.phone_in_talk_rounded, size: 16),
                          label: const Text('Call', style: TextStyle(fontSize: 12)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: OutlinedButton.icon(
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.red.shade700,
                            side: BorderSide(color: Colors.red.shade300),
                          ),
                          onPressed: _showCancelRideDialog,
                          icon: const Icon(Icons.cancel_outlined, size: 16),
                          label: const Text('Cancel Ride', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF0F8A3C),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 10),
                          ),
                          onPressed: () {
                            _showRatingModal(isCancelled: false);
                          },
                          child: const Text('Complete & Rate', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Custom Route Painter with animated moving driver along path
class _MapRoutePainter extends CustomPainter {
  final double progress;

  _MapRoutePainter(this.progress);

  @override
  void paint(Canvas canvas, Size size) {
    final bgPaint = Paint()..color = const Color(0xFF1E293B);
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), bgPaint);

    // Draw secondary road grid
    final gridPaint = Paint()
      ..color = const Color(0xFF334155)
      ..strokeWidth = 1.0;

    for (double y = 40; y < size.height; y += 50) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), gridPaint);
    }
    for (double x = 40; x < size.width; x += 60) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), gridPaint);
    }

    // Main Transit Road
    final roadPaint = Paint()
      ..color = const Color(0xFF475569)
      ..strokeWidth = 12.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final startPoint = Offset(size.width * 0.15, size.height * 0.78);
    final ctrl1 = Offset(size.width * 0.35, size.height * 0.25);
    final ctrl2 = Offset(size.width * 0.65, size.height * 0.85);
    final endPoint = Offset(size.width * 0.85, size.height * 0.22);

    final path = Path()
      ..moveTo(startPoint.dx, startPoint.dy)
      ..cubicTo(ctrl1.dx, ctrl1.dy, ctrl2.dx, ctrl2.dy, endPoint.dx, endPoint.dy);

    canvas.drawPath(path, roadPaint);

    // Active Route Line (Saffron)
    final routePaint = Paint()
      ..color = const Color(0xFFF58220)
      ..strokeWidth = 4.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    canvas.drawPath(path, routePaint);

    // Pickup Location Pin (Green)
    final pickupPaint = Paint()..color = const Color(0xFF0F8A3C);
    canvas.drawCircle(startPoint, 9, pickupPaint);
    canvas.drawCircle(startPoint, 4, Paint()..color = Colors.white);

    // Dropoff Location Pin (Saffron)
    final dropPaint = Paint()..color = const Color(0xFFF58220);
    canvas.drawCircle(endPoint, 9, dropPaint);
    canvas.drawCircle(endPoint, 4, Paint()..color = Colors.white);

    // Calculate Driver position along cubic bezier curve: B(t)
    final t = progress.clamp(0.0, 1.0);
    final u = 1.0 - t;
    final driverX = u * u * u * startPoint.dx +
        3 * u * u * t * ctrl1.dx +
        3 * u * t * t * ctrl2.dx +
        t * t * t * endPoint.dx;
    final driverY = u * u * u * startPoint.dy +
        3 * u * u * t * ctrl1.dy +
        3 * u * t * t * ctrl2.dy +
        t * t * t * endPoint.dy;

    final driverPos = Offset(driverX, driverY);

    // Radar pulse ring around driver
    final pulsePaint = Paint()
      ..color = const Color(0xFF0F8A3C).withOpacity(0.35)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(driverPos, 18, pulsePaint);

    // Driver Marker Core
    final markerPaint = Paint()..color = const Color(0xFF0B1B3D);
    final borderPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2.5;

    canvas.drawCircle(driverPos, 10, markerPaint);
    canvas.drawCircle(driverPos, 10, borderPaint);

    // Inner bright center (Saffron)
    canvas.drawCircle(driverPos, 4, Paint()..color = const Color(0xFFF58220));
  }

  @override
  bool shouldRepaint(covariant _MapRoutePainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}

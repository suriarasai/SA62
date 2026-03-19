package sg.edu.choppee.config;

import sg.edu.choppee.service.CartService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

/**
 * Injects cross-cutting model attributes into every Thymeleaf template:
 *   ${loggedInUser}   – username string or null
 *   ${cartItemCount}  – total items currently in the user's cart
 */
@ControllerAdvice
public class GlobalControllerAdvice {

    @Autowired
    private CartService cartService;

    @ModelAttribute("loggedInUser")
    public String loggedInUser(HttpSession session) {
        return (String) session.getAttribute("username");
    }

    @ModelAttribute("loggedInUserId")
    public Long loggedInUserId(HttpSession session) {
        return (Long) session.getAttribute("userId");
    }

    @ModelAttribute("cartItemCount")
    public int cartItemCount(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return 0;
        return cartService.countItems(userId);
    }
}
